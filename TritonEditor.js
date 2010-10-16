var TritonEditor = (function(window){
    var obj = {};
    var ui;
    var thread;
    var sidebar;
    var encoder;

    // Initializes the Editor
    obj.init = function(){

        encoder = window.Encoder(window.localStorage);

        thread = getCurrentThread();
        
        // Create the user interface
        ui = TritonKUI(thread, encoder, obj);
        ui.init();

        // Create the sidebar
        sidebar = TritonSidebar(thread);

        // Check if this is the first time
        if(thread.count() == 0){
            thread.createPost("(Click to Edit)");
        }

        // Draw the Window
        obj.draw();

        // Draw the sidebar
        sidebar.init();

    }

    obj.getThread = function(){
        return thread;
    }

    obj.getEncoder = function(){
        return encoder;
    }

    var getCurrentThread = (function(){

        var thread;
        var post_key = window.location.hash.substr(1);

        // Check if a thread has already been saved
        if(post_key == "new"){

            // If not, create one
            thread = encoder.create();

            // Add it to the index
            if(typeof window.localStorage.getItem("thread_index") != "string"){
                window.localStorage.setItem("thread_index", JSON.stringify([]));
            }

            var threads = JSON.parse(window.localStorage.getItem("thread_index"));
            threads.push({
                "id" : thread.getID(),
                "title" : thread.getTitle()
            });
            window.localStorage.setItem("thread_index", JSON.stringify(threads));
            location.hash = thread.getID();


        }else if(typeof window.localStorage.getItem(post_key) != "string"){

            location.hash = "new";
            location.reload(true);

        }else{

            // Retrieve the saved thread
            thread = encoder.restore(post_key);

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