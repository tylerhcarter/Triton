var TritonKUI = (function(thread, threadEncoder, editor){
    var obj = {};

    obj.init = function(){
        resetBindings();
    };

    var openPost = function(){

        // Grab information about the post
       var id = $(this).attr("id");
       var post = thread.getPost(id);

       // Replace it with a text area
       $(this).replaceWith("<section id=\"" + id + "\"><textarea>"+post.post_content.plain+"</textarea></section>");

       // Focus the Textarea upon creation and set the blur event
       $('textarea').focus();
       $("textarea").blur(closePost);

       // Styling
       $('textarea').parent().addClass("active");
       $('textarea').autogrow();

       // Text Editor Keybindings
        $('textarea').bind('keydown', 'ctrl+return', function(){
            editor.createPost();
        })
    }

    var closePost = function(){

       // Gather information about the post/textarea
       var section = $(this).parent();
       var id = $(section).attr("id");
       var text = $(this).val();

       // Check if the post is empty
       if(text == ""){

           // Remove the post
           thread.remove(id);
           threadEncoder.sleep("thread", thread);
           editor.draw();
           
           return;

       }else{
           // Otherwise, Save the post
           if(thread.modifyPost(id, text) == false){

               // If post isn't found, prevent erasing the content
               alert("Post not found. Changes have not been saved.");
           }
           else
           {
                $('textarea').unbind('keydown');

                // Refresh the Post
                var post = thread.getPost(id);
                threadEncoder.sleep("thread", thread);
                editor.draw();
                
           }
       }       
    }

    // Sets the bindings on the general page
    var resetBindings = function(){
        $("section").click(openPost);
        $(document).bind("keypress", "n", function(){
            editor.createPost();
            return false;
        })
    }

    return obj;
});