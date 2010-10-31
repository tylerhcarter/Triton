var TritonEditor = (function(window){
    var obj = {};
    var ui;
    var thread;
    var sidebar;
    var encoder;
    var index;
    index = ThreadIndex(window.localStorage);

    var manager;
    manager = window.ThreadManager(window.localStorage);
    
    var slider;

    var notifier = window.Notifier();

    // Initializes the Editor
    obj.init = function(){
        
        index.init();
        manager.init();

        // Create the user interface
        ui = TritonKUI(obj);

        // Create the sidebar
        sidebar = TritonSidebar(obj);
        notifier.register(sidebar);
        
        // Get the current thread
        thread = getCurrentThread();

        // Check if a thread is selected
        if(thread != false){

            // Check if there are no items
            if(thread.count() == 0){
                thread.createPost("(Click to Edit)");
            }


        }else{

            // Welcome Screen

        }

        // Draw the Window
        obj.draw();

        // Initialize the UI
        ui.init();

        // Draw the Sidebar
        TritonNav(sidebar).init();
        sidebar.init();
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
    }

    obj.setThread = function(newThread){
        thread = newThread;
    }

    obj.clearThread = function(){
        thread = false;
    }


    obj.loadThread = function(id){
        thread = manager.getThread(id);
    }

    obj.getThread = function(){
        return thread;
    }

    obj.current = function(){
        if(typeof thread.getID == "function"){
            return thread;
        }else{
            return false;
        }
    }

    obj.getManager = function(){
        return manager;
    }

    obj.getEncoder = function(){
        return manager.getEncoder();
    }

    obj.getIndex = function(){
        return manager.getIndex();
    }

    var getCurrentThread = (function(){

        var thread;
        var post_key = window.location.hash.substr(1);

        // Check if a thread has already been saved
        if(post_key == "new"){

            // If not, create one
            thread = manager.createThread();
            location.hash = thread.getID();

        }else if(typeof window.localStorage.getItem(post_key) != "string"){

            return false;

        }else{

            // Retrieve the saved thread
            thread = manager.getThread(post_key);

        }

        return thread;

    });

    // Controls the displaying of posts
    // TODO: Move to separate file
    var posts = (function(editor){

        var obj = {};
        var thread = false;
        obj.draw = function(editor){

            thread = editor.current();

            if(editor.current()){
                drawPosts();
            }else{
                drawWelcome();
            }
        }

        function drawPosts(){
            var posts = thread.getPosts();
            var l = posts.length;

            var div = $("<div />",{
                "id" : "posts"
            });

            // Add the title
            $("<header />", {
               "html": thread.getTitle(),
               "id" : "title"
            }).appendTo(div);

            // Add each post
            for(var i=0; i<l; i++){
                var current = posts[i];
                var post = $("<section />", {
                    "html" : current.post_content.html,
                    "id" : current.post_id
                })
                $(post).appendTo(div);
            }
            $("#posts").replaceWith(div);
        };

        function drawWelcome(){
            var div = $("<div />",{
                "id" : "posts",
                "html" : "No Posts Current Active"
            });
            $("#posts").replaceWith(div);
        };

        return obj;
    })();
    notifier.register(posts);


    // Creates a new post on a thread
    // TODO: Move tot he KUI 
    obj.createPost = function(){

        // Leave any currently open textareas
        $('textarea').blur();

        // Create the new post and save
        var id = thread.createPost("");

        // Redraw the window
        obj.draw();

        // Select the new textarea
        $("#" + id).click();
    }

    
    return obj;
});