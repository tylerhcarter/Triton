var TritonEditor = (function(thread, threadEncoder){
    var obj = {};
    var loader;

    obj.start = function(){

        // Create the user interface
        loader = TritonUI(thread, threadEncoder, obj);

        // Draw the Window
        obj.draw();

    }

    obj.draw = function(){
        draw();
    }

    function draw(){
        $("#posts").html("");

        var posts = thread.getPosts();
        var l = posts.length;

        var html = $([]);

        for(var i=0; i<l; i++){
            var current = posts[i];
            html.append("<section id=\""+ current.post_id +"\">"
                                        + current.post_content.html + "</section>");
        }
        $("#posts").replaceWith(html);
        loader.init();
    }

    obj.createNewPost = function(){

        // Leave any currently open textareas
        $('textarea').blur();

        // Create the new post and save
        var id = thread.createPost("");
        threadEncoder.sleep("thread", thread);

        // Redraw the window
        draw();

        // Select the new textarea
        $("#" + id).click();
    }

    
    return obj;
});