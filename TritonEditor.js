var TritonEditor = (function(thread, threadEncoder){
    var obj = {};
    var ui;

    // Initializes the Editor
    obj.init = function(){

        // Create the user interface
        ui = TritonKUI(thread, threadEncoder, obj);
        ui.init();

        // Check if this is the first time
        if(thread.count() == 0){
            thread.createPost("(Click to Edit)");
        }

        // Draw the Window
        obj.draw();

    }

    // Draws the HTML
    // Note: The sidebar needs to be redrawn as well
    obj.draw = function(){

        var posts = thread.getPosts();
        var l = posts.length;

        var div = $("<div />",{
            "id" : "posts"
        });

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
    }

    obj.createPost = function(){

        // Leave any currently open textareas
        $('textarea').blur();

        // Create the new post and save
        var id = thread.createPost("");
        threadEncoder.sleep("thread", thread);

        // Redraw the window
        obj.draw();

        // Select the new textarea
        $("#" + id).click();
    }

    
    return obj;
});