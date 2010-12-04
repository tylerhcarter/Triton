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

        obj.createAlert("Running Triton " + version + ". Enjoy.", "low");
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

        try{
            
            // Check if a thread with this ID exists
            if(typeof window.localStorage.getItem(hash) == "string"){
                return manager.getThread(hash);
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
        index.deleteIndex(obj.current().getID())

        // Move back a post
        var threads = index.getIndex();

        if(threads.length > 0){
            var last = threads[threads.length - 1].id;
            location.hash = last;
            obj.loadThread(last);
            obj.draw();
        }else{
            location.hash = "";
            obj.clearThread();
            obj.draw();
        }
    }

    // Alerts
    obj.createAlert = function(message, priority, timeout){

        if(priority != "high" && priority != "medium" && priority != "low"){
            priority = "medium";
        }

        if(typeof timeout != "number" && timeout != false){
            timeout = 5000;
        }

        var box = $("<div>", {
            "class" : "alert " + priority,
            "html" : message,
            "style" : "display: none"
        });

        $("body").append(box);
        $(box).fadeIn('slow');

        if(timeout != false){
            setTimeout(obj.clearAlert, timeout);
        }

    }

    obj.createDevAlert = function(message, priority, timeout){
        if($t.debug == true){
            obj.createAlert(message, priority, timeout);
        }
    }

    obj.clearAlert = function(){
        $(".alert").fadeOut('slow', function(){
            $(this).remove();
        })
    }

    var status = obj.load();
    if(status == false){
        return false;
    }
    else{
        return obj;
    }
});