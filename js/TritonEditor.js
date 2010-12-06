window.Triton.TritonEditor = (function(window){
    var obj = {};
    var $t = window.Triton;
    var index,
        manager,
        notifier,
        posts,
        ui,
        thread,
        sidebar;


    // Loads the base objects
    obj.load = function(){

        // Construct base objects
        assert(typeof Notifier != "undefined", "TritonEditor.js->TritonEditor(); Notifier not found.")
        notifier = Notifier();

        try{

            assert(typeof $t.ThreadManager != "undefined", "TritonEditor.js->TritonEditor(); ThreadManager not found.")
            manager = $t.ThreadManager(window.localStorage);

            assert(typeof $t.ThreadIndex != "undefined", "TritonEditor.js->TritonEditor(); ThreadIndex not found.")
            index = $t.ThreadIndex(window.localStorage);

            assert(typeof $t.TritonPosts != "undefined", "TritonEditor.js->TritonEditor(); TritonPosts not found.");
            posts = $t.TritonPosts();

        }catch(e){
            obj.createAlert("Error: " + e.getMessage(), "high", false)
            return false;
        }

        // Check for other depedant objects
        // (These objects are initialized later due to dependencies)
        var requiredObjs = [
            "Thread",
            "Encoder",
            "ThreadIndex",
            "ThreadManager",
            "TritonKUI",
            "TritonSidebar"
        ];
        var len = requiredObjs.length;
        for(var i = 0; i < len; i++){
            assert(typeof $t[requiredObjs[i]] != "undefined", "TritonEditor.js->TritonEditor(); "+ requiredObjs[i] +" not found.");
        }

        return true;

    }
    
    // Initializes the Editor
    obj.init = function(){

        // Initialize the thread system
        index.init();
        manager.init();

        // Get the current thread
        thread = loadCurrentThread();

        // Create UI Object
        ui = $t.TritonKUI(obj);

        // Create Sidebar Object
        sidebar = $t.TritonSidebar(obj);
        $t.TritonNav(sidebar).init();
        sidebar.init();

        // Register objects to be notified upon changes
        notifier.register(sidebar);
        notifier.register(posts);
        
        // Draw the Window
        obj.draw();

        // Display Version Information
        var version = $t.version;
        if($t.debug == true){
            version += " Dev";
        }

        // Check if we've updated
        if(window.localStorage.getItem("updated") == "yes"){
            
            if($t.debug == true){
                obj.createAlert("You've updated to Triton " + version + ". Built " + $t.updated + " " + $t.updated_time + ". Enjoy.", "low", 10000);
            }else{
                obj.createAlert("You've updated to Triton " + version + ". Enjoy.", "low", 10000);
            }

            window.localStorage.removeItem("updated");

        }else{

            if($t.debug == true){
                obj.createAlert("Running Triton " + version + ". Built " + $t.updated + " " + $t.updated_time + ". Enjoy.", "low");
            }else{
                obj.createAlert("Running Triton " + version + ". Enjoy.", "low");
            }
            
        }

        $("<div>", {
            "class" : "meta",
            "html" : "v" + version + " - " + "Build " + $t.updated
        }).appendTo("nav > header");

        

        
    }

    // Draws the HTML
    obj.draw = function(bindEvents, callback){

        if(typeof bindEvents == "undefined"){
            bindEvents = true;
        }

        // Notify the other modules that something has changed
        notifier.notify("draw", obj);

        // Allows for disabling the default UI
        // TODO: This should really be triggered by the posts module
        if(bindEvents == true){
            ui.init();
        }

        if(typeof callback == "function"){
            callback();
        }

        return true;
    }
    obj.redraw = function(){obj.draw();}

    // Loads the current thread from memory based on the URL fragment
    function loadCurrentThread(){

        // Get the current post ID
        var hash = window.location.hash.substr(1);
		var components = hash.split('/');

        try{
            // Check if a thread with this ID exists
            if(typeof window.localStorage.getItem(components[0]) == "string"){
                return manager.getThread(components[0]);
            }else{
                return false;
            }
            
        }catch(e){
            obj.alert("Could not auto-load thread.", "high");
        }
    }

    // Returns the current thread object
    obj.getThread = function(){
        if(typeof thread == "undefined"){
            return false;
        }else{
            return thread;
        }
        
    }
    obj.current = function(){return obj.getThread();}

    obj.loadThread = function(id){
        thread = manager.getThread(id);
    }
    obj.setThread = function(newThread){
        thread = newThread;
    }
    obj.clearThread = function(){
        thread = false;
    }

    // Thread System Accessors
    obj.getManager = function(){return manager;}
    obj.getEncoder = function(){return manager.getEncoder();}
    obj.getIndex = function(){return manager.getIndex();}

    // Reloads the page
    obj.reload = function(){
        location.reload(true);
    }

    // Creates a new post on the current thread
    obj.createPost = function(){
        $('textarea').blur();
        var id = obj.current().createPost("");

        // Display the box and focus it
        obj.draw();
        $("#" + id).click();
    }

    // Creates a new thread
    obj.createDocument = function(){
        var thread = manager.createThread("Test");
        thread.createPost("test");
        location.hash = thread.getID();
        obj.loadThread(location.hash.substr(1));
        obj.draw();
    }

    // Deletes the current thread and focuses the last thread
    obj.deleteDocument = function(){
        
        // Delete the Post
        manager.removeThread(obj.current().getID());

        // Move back a post
        var threads = index.getIndex();

        if(threads.length > 0){
            var last = threads[0].id;
            location.hash = last;
            obj.loadThread(last);
            obj.draw();
        }else{
            location.hash = "";
            obj.clearThread();
            obj.draw();
        }
    }

    function _showDialog(div) {
        $('.page_dialog').hide('slow', function() {
            $('.page_dialog').remove();
        });
        $(div).addClass('page_dialog').appendTo(document.body).show('slow');
    }

	// Export functionality. Allows document to be exported into many
	// different formats.

	obj.exporters = {
		json: function(threads) {
				  return JSON.stringify(threads);
              },
        html: function(threads) {
                  var all_html = '';

                  for (var i = 0; i < threads.length; i++) {
                      var thread = threads[i];
                      var posts = thread.thread_posts;

                      all_html += '<h1 id="' + thread.thread_id + '">' + thread.thread_title + '</h1>';
    
                      for (var j = 0; j < posts.length; j++) {
                          all_html += posts[j].post_content.html;
                      }
                  
                  }

                  return all_html;
              }
	};
    obj.exporters.json.displayName = 'JSON';
    obj.exporters.html.displayName = 'HTML';


	obj.exportCurrent = function(format) {
		return obj.exporters[format || 'json'](manager.getAll());
	};

	obj.dumpDocument = function(format) {
		// Find all documents
		var exported = obj.exportCurrent(format || 'json');
		var layer;

        // If we have, in fact, already shown the dialog, just re-export!
		if ($('#export').length)
			return $('#export_contents').val(exported);

        // First, generate the format selection box
        var formatSelection = $('<select/>').attr('id', 'export_format');
        for (var exporter in obj.exporters) {
            if (obj.exporters.hasOwnProperty(exporter)) {
                var caption = obj.exporters[exporter].displayName;
                var element = $('<option/>').attr('value', exporter).text(caption);
                formatSelection.append(element);
            }
        }
        // It has to re-export the document every time it changes
        formatSelection.bind('change', function (ev) {
            obj.dumpDocument($(this).val());
        });


        // Now, generate the main DIV containing the exported text
		layer = $('<div/>')
			.attr('id', 'export')
			.append($('<div/>').text('Export').addClass('dialog_title'))
			.append($('<br/>'))
			.append($('<div/>').text('Copy the following text:'))
			.append($('<textarea/>')
						.attr('id', 'export_contents')
                        .addClass('dump_area')
						.val(exported))
            .append($('<div/>')
                        .css('float', 'left')
                        .append(formatSelection))
			.append($('<div/>')
						.css('float', 'right')
						.append($('<button/>')
									.text('Close')
									.click(function() {
                                        layer.hide('slow', function() {
                                            layer.remove();
                                        });
									})));

        _showDialog(layer);
	};

    // Import. It's kinda the opposite of export.
    obj.importers = {
        json: function(input) {
                  var threads = $.parseJSON(input);
                  var newThreadId;
                  
                  for (var i = 0; i < threads.length; i++) {
                      var original = threads[i];
                      var thread = manager.createThread();
                      thread.title.set(original.thread_title);
                      newThreadId = thread.getID();

                      var posts = original.thread_posts;
                      for (var j = 0; j < posts.length; j++) {
                          var post = thread.posts.create('');
                          thread.posts.modify(post, posts[j].post_content.plain);
                      }
                  }

                  // Load last thread imported
                  location.hash = newThreadId;
                  obj.loadThread(newThreadId);
                  obj.draw();
              }
    };
    obj.importers.json.displayName = 'JSON';

    obj.importToDocument = function(input, format) {
        obj.importers[format || 'json'](input);
    };

    obj.importDisplay = function(input, format) {
        // First: generate the dialog

        // Generate the format selection box
        var formatSelection = $('<select/>').attr('id', 'import_format');
        for (var importer in obj.importers) {
            if (obj.importers.hasOwnProperty(importer)) {
                var caption = obj.importers[importer].displayName;
                var element = $('<option/>').attr('value', importer).text(caption);
                formatSelection.append(element);
            }
        }

        // Crash 'n' burn
        var hideDestroyImport = function() {
            $('#import').hide('slow', function() {
                $('#import').remove();
            });
        };
        
        // Now the DIV
        var layer = $('<div/>')
            .attr('id', 'import')
            .append($('<div/>').addClass('dialog_title').text('Import'))
            .append($('<div/>').text('Select the appropriate format, paste in your document, and click OK to import.'))
            .append($('<br/>'))
            .append($('<table/>')
                        .css('width', '100%')
                        .append($('<tr/>').append($('<td>Format: </td>'))
                            .append($('<td/>').append(formatSelection)))
                        .append($('<tr/>').append($('<td>Contents: </td>'))
                            .append($('<td/>')
                                .append($('<textarea/>').attr('id', 'import_contents').addClass('dump_area'))))
                        .append($('<tr/>').append($('<td/>'))
                            .append($('<td/>')
                                .append($('<button>Import</button>').click(function(ev) {
                                        obj.importToDocument($('#import_contents').val(), $('#import_format').val());
                                        hideDestroyImport();
                                    }))
                                .append($('<button>Close</button>').click(function(ev) {
                                        hideDestroyImport();
                                })))));

        _showDialog(layer);
    }

    // Alerts
    obj.createAlert = function(message, priority, timeout){

        if(priority != "high" && priority != "medium" && priority != "low"){
            priority = "medium";
        }

        if(typeof timeout != "number" && timeout !== false){
            timeout = 5000;
        }

        var box = $("<div>", {
			"id": 'alert-' + window.generateUUID(),
            "class" : "alert " + priority,
            "html" : message,
            "style" : "display: none"
        });

        $("body").append(box);

		var offset = ($('.alert').length - 1) * (box.height() * 1.75);
		var newBottom = parseInt(box.css('bottom'), 10) + offset;
		box.css('bottom', newBottom + 'px');

        $(box).fadeIn('slow');

        if(timeout != false){
            setTimeout(obj.clearAlert(box.attr('id')), timeout);
        }

    }

    obj.createDevAlert = function(message, priority, timeout){
        if($t.debug == true){
            obj.createAlert(message, priority, timeout);
        }
    }

    obj.clearAlert = function(id){
		return (function() {
			$('#' + id).addClass('fading_out');
	        $("#" + id).fadeOut('slow', function(){
    	        $(this).remove();
				$('.alert:not(.fading_out)').each(function (i, x) {
					x = $(x);

					var newBottom = parseInt(x.css('bottom'), 10) - x.height();
					x.css('bottom', newBottom + 'px');
				});
        	});
		});
    }

    var status = obj.load();
    if(status == false){
        return false;
    }
    else{
        return obj;
    }
});
