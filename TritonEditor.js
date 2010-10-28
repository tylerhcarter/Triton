var TritonEditor = (function(window){
    var obj = {};
    var ui;
    var thread;
    var sidebar;
    var encoder;
    var index;
    var manager;

    // Initializes the Editor
    obj.init = function(){

        index = ThreadIndex(window.localStorage);
        index.init();

        // Create the Thread Manager
        manager = window.ThreadManager(window.localStorage);
        manager.init();

        // Create the user interface
        ui = TritonKUI(obj);

        // Create the sidebar
        sidebar = TritonSidebar(obj);

        // Get the current thread
        thread = getCurrentThread();
        if(thread != false){

            // Check if there are no items
            if(thread.count() == 0){
                thread.createPost("(Click to Edit)");
            }

            // Draw the Window
            obj.draw();

        }

        // Initialize the UI
        ui.init();

        // Draw the Sidebar
        TritonNav(sidebar).init();
        sidebar.init();
        

    }

    obj.setThread = function(newThread){
        thread = newThread;
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

    // Draws the HTML
    // Note: The sidebar needs to be redrawn as well
    obj.draw = function(){

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
        ui.init();
        sidebar.draw();
    }

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