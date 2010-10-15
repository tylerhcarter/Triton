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
                editor.draw();
                
           }
       }       
    }

    // Sets the bindings on the general page
    var resetBindings = function(){
        $("section").unbind("click");
        $("section").click(openPost);
        $(document).unbind("keypress");
        $(document).bind("keypress", "n", function(){
            editor.createPost();
            return false;
        })

        var bind = function(){

           var title = $(this).text();
           var header = $("<header />", {
               "id" : "title"
           });

           $("<input>", {
                "val" : title,
                "type" : "text"
           }).appendTo(header);

           $("#title").replaceWith(header);
           $("#title input").focus();
           $("#title input").blur(function(){

               var title = $("#title input").val();
               thread.modifyTitle(title);
               var header = $("<header />", {
                  "id" : "title",
                  "html" : title
               });

               $("#title").replaceWith(header);
               $("#title").click(bind);
               editor.draw();
           })

        };
        $("#title").click(bind);


    }

    return obj;
});