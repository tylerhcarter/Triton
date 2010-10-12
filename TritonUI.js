var TritonUI = (function(thread, threadEncoder, editor){
    var obj = {};

    obj.init = function(){
        resetBindings();
    };

    function resetBindings(){
        $(document).unbind('keydown');

        $("section").click(bindPost);
        $(document).bind('keydown', 'ctrl+n', function(){
            editor.createNewPost();
        })
    }

    var savePost = function(){
       var section = $(this).parent();
       var id = $(section).attr("id");
       var text = $(this).val();

       // Check if the post is empty
       if(text == ""){

           // Remove the post
           thread.remove(id);
           threadEncoder.sleep("thread", thread);
           editor.draw();
           
           return true;
       }

       // Save the post
       if(thread.modifyPost(id, text) == false){
           alert("Post Not Found");
       }
       else
       {
            // Refresh the Post
            var post = thread.getPost(id);
            threadEncoder.sleep("thread", thread);

            // Redraw the page
            editor.draw();

            // Note: It might be more efficent on large pages to
            //       only redraw one part of the page
       }
    }

    var bindPost = function(){

       var id = $(this).attr("id");
       var post = thread.getPost(id);
       $(this).replaceWith("<section id=\"" + id + "\"><textarea>"+post.post_content.plain+"</textarea></section>");
       openTextBox();
       $('textarea').focus();
       $('textarea').parent().addClass("active");
       $("textarea").blur(savePost);
       $('textarea').autogrow();
    };

    var openTextBox = function(){
        //$(document).bind('keydown', 'ctrl+a', fn);
        $('textarea').bind('keydown', 'ctrl+return', function(){
            $('textarea').blur();
        })
        $('textarea').bind('keydown', 'ctrl+n', function(){
            editor.createNewPost();
        })
    }

    var closeTextBox = function(){
        $('textarea').unbind('keydown');
    }

    return obj;
});