window.Triton.TritonSidebar = (function(editor){
    var obj = {};

    obj.init = function(){
        obj.register.notify();
        if(editor.current()){
            overview.init();
        }
        documents.init();

        bindNav();
        window.Triton.menuOpen = false;
    }

    function bindNav(){
        
        var openNav = function(){
            $("nav").animate({"right": "0px"});
            $("#wash").show()
            $("#logo").unbind("click");
            $("#logo").click(closeNav);
            $("#wash").click(closeNav);
            window.Triton.menuOpen = true;
        }

        var closeNav = function(){
            $("nav").animate({"right": "-320px"});
            $("#wash").hide()
            $("#logo").unbind("click");
            $("#logo").click(openNav);
            window.Triton.menuOpen = false;
        }
        $("#logo").click(openNav);

        if(editor.current() == false){
            //$("#logo").click();
        }
    }

    obj.draw = function(){
        obj.register.notify();
        if(editor.current()){
            overview.draw();
        }
        documents.init();
    }

    obj.register = (function(editor){

        var obj = {};
        var nodes = [];

        obj.register = function(node){
            if(typeof node.update == "function"){
                nodes.push(node);
                return true;
            }else{
                return false;
            }
        }

        obj.notify = function(){
            var len = nodes.length;
            for(var i = 0; i < len; i++){
                nodes[i].update(editor);
            }
        }

        return obj;

    })(editor);

    var overview = (function(){
        var obj = {};

        obj.init = function(){
            loadThreads();
        }

        obj.draw = function(){
            loadThreads();
        }

        var loadThreads = function(){
            var len;
            var titles = [];
            var thread = editor.current();
            
            var posts = thread.posts.getAll();
            var postsLength = posts.length;
            for(var i=0; i < postsLength; i++){
                if(posts[i].post_title != "" && posts[i].post_title != null){
                    titles.push({
                        "title" : posts[i].post_title,
                        "id" : posts[i].post_id
                    });
                }
            }

            if(titles.length > 0){
                
                var html = $("<div />", {
                    "id" : "overview"
                });

                $("<header />", {
                    "html" : "Overview"
                }).appendTo(html);

                var list = $("<ul />",{
                    "id" : "overview-list"
                });

                var titlesLength = titles.length;
                for(var i=0; i < titlesLength; i++){
					var title_id = titles[i].id;

					// stupid closure workaround (title_id remains constant)
					// Generates a click handler which animates the transition between
					// posts.
					var genClick = function(id) {
						return (function(ev) {
							var targetHash = '#' + id;
							var element = $(targetHash);

							$('body,html').animate(
								{ scrollTop: element.position().top },
								{
									duration: 'slow',
									complete: function() {
										location.hash = thread.getID() + '/' + id;
									}
								});
						});
					};

                    $("<li />",{
                        html: $("<a \>").click(genClick(titles[i].id)).html(titles[i].title)
                    }).appendTo(list);
                }

                $(list).appendTo(html);

                $("#overview").replaceWith(html).show();

            }
            else
            {
                $("#overview").replaceWith($("<div />", {
                    "id" : "overview"
                }))
                $("#overview").hide();
            }
        }

        return obj;
    })();

    var documents = (function(){

        var obj = {};

        obj.init = function(){
            draw();
        }

        obj.draw = function(){
            draw();
        }

        var draw = function(){

            // Check if a thread is active
            var currentThread = editor.current();
            var currentID = false;
            if(currentThread != false){
                currentID = currentThread.getID();
            }

            // Get the threads
            var index = editor.getIndex();
            index.refresh();
            
            var threads = index.getIndex();
            
            // Output each document into a list
            var list = $("<ul />", {
                "id" : "document-list"
            });

            var len = threads.length;
            for(var i=0; i < len; i++){
                var obj = threads[i];
                
                assert(obj != false, "TritonSidebar.js->Sidebar->Documents->Draw(); Bad Thread Returned (Obj was False)");
                assert(typeof obj.id != "undefined", "TritonSidebar.js->Sidebar->Documents->Draw(); Bad Thread Returned (No ID Property)");
                assert(typeof obj.title != "undefined", "TritonSidebar.js->Sidebar->Documents->Draw(); Bad Thread Returned (No Title Property)");

                // Highlight the current thread
                if(obj.id == currentID){
                    $(makeItem(obj, true)).appendTo(list);
                }else{
                    $(makeItem(obj, false)).appendTo(list);
                }
            }

            $("#document-list").replaceWith(list);

            // If the user clicks on a document, switch to it
            $("#document-list a").click(function(){
               location.hash = $(this).attr("href");
               editor.loadThread($(this).attr("href").substr(1));
               editor.draw();
            });
        }

        function makeItem(obj, active){

            if(typeof active == undefined){
                active = false;
            }

            var item = $("<li>");
            if(active == true){
                $(item).addClass("active");
            }

            var html = "<img src=\"images/document.png\"><span class=\"title\">" + obj.title + "</span>\n\
                        <span class=\"date\">Updated 12-6-2010</span>";

            if(obj.post_count == 1){
                html += "<span class=\"count\">Contains " + obj.post_count + " post</span>";
            }else{
                html += "<span class=\"count\">Contains " + obj.post_count + " posts</span>";
            }

            $("<a />", {
                "href" : "#" + obj.id,
                "html" : html
            }).appendTo(item);

            return item;

        }
        
        return obj;

    })();

    return obj;
});




window.Triton.TritonNav = (function(sidebar){
    var obj = {};
    var editor = false;
    
    var binds = {
        "new_doc": function(){
            editor.createDocument();
        },
        "view_docs": function(){
            $("#logo").click();
        },
        "delete_doc" : function(){
            editor.deleteDocument();
        },
        "new_post" : function(){
            editor.createPost();
        },
        "dump": function() {
                editor.dumpDocument();
        },
        "import_display": function() {
            editor.importDisplay();
        }
    }

    obj.init = function(){
        sidebar.register.register(obj);
    }

    obj.draw = function(){

        var list = $("<ul />", {
            "id" : "links"
        });

        // Make Basic Menu Items
        $(makeItem("new_doc", "New Document")).appendTo(list);
        if(editor.current()){
            $(makeItem("delete_doc", "Delete Document")).appendTo(list);
        }
        $(makeItem("view_docs", "View Documents")).appendTo(list);

        // Make Per-Thread Items (if a thread is open)
        if(editor.current()){
            $("<div>", {
                "class" : "break"
            }).appendTo(list);
            
            $(makeItem("new_post", "Add Post")).appendTo(list);
        }

        $("<div>", {
            "class" : "break"
        }).appendTo(list);

        $(makeItem("import_display", "Import")).appendTo(list);
        $(makeItem("dump", "Export")).appendTo(list);

        $("#links").replaceWith(list);
    }

    obj.update = function(editorObj){
        editor = editorObj;
        obj.draw();
    }

    function makeItem(id, text){
        var item = $("<li />");
        var button = $("<a />", {
            "id" : id,
            "text" : text
        });

        // If a bind exists for this button, set it
        if(typeof binds[id] == "function"){
            $(button).click(binds[id]);
        }

        $(button).appendTo(item);
        return item;
    }

    return obj;
})

