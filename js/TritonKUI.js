window.Triton.TritonKUI = (function(editor){
    var obj = {};

    obj.init = function(){
        resetBindings();
    };

    var openPost = function(){
        $(this).unbind("click");
        var thread = editor.current();
        
        // Grab information about the post
       var id = $(this).attr("id");
       var post = thread.posts.get(id);

       // Replace it with a text area
       $(this).html("<textarea>"+post.post_content.plain+"</textarea>");

       // Focus the Textarea upon creation and set the blur event
       $('textarea').focus();
       $("textarea").blur(closePost);

       // Styling
       $('textarea').parent().addClass("active");
       $('textarea').autogrow();

       // Text Editor Keybindings
        $('textarea').bind('keydown', 'ctrl+return', function(){
            editor.createPost();
        });

    	$('textarea').keydown(function(ev) {
            if (ev.which == 27) {
                closePost.call(ev.target);
            }
        });

        // Text formatting shortcuts
        $('textarea').keydown(function(ev) {
            var do_surround = function(str, inside) {
                var text  = $(ev.target).val();
                var start = ev.target.selectionStart;
                var end   = ev.target.selectionEnd;

                // If there's already text selected, surround that with appropriate formatting
                if (ev.target.selectionEnd - start != 0) {
                    var preSelection  = text.substring(0, start);
                    var selected      = text.substring(start, end);
                    var postSelection = text.substring(end);

                    text = preSelection + str + selected + str + postSelection;

                    // Restore selection accounting for new formatting marks.
                    start += str.length;
                    end = start + selected.length;
                }
                // Otherwise, stick some new text in.
                else {
                    var real_inside = inside || 'text';
                    var to_insert = str + real_inside + str;
    
                    text = text.substring(0, start) + to_insert + text.substring(start);

                    // Position the cursor inside - e.g. **|text** - | is the cursor.
                    start  = start + str.length;
                    // Only select the stuff inside e.g. **<text>**.
                    end    = start + real_inside.length;
                }

                $(ev.target).val(text);
                ev.target.selectionStart = start;
                ev.target.selectionEnd = end;
            };

            // Ctrl+B
            if (ev.which == 66 && ev.ctrlKey){
                do_surround('**');
                ev.preventDefault();
            }
            // Ctrl+I
            else if (ev.which == 73 && ev.ctrlKey){
                do_surround('*');
                ev.preventDefault();
            }
        });
    }

    var closePost = function(){

       // Gather information about the post/textarea
       var section = $(this).parent();
       var id = $(section).attr("id");
       var text = $(this).val();
       var thread = editor.current();

       // Check if the post is empty
       if(text == ""){

           // Remove the post
           thread.posts.remove(id);
           editor.draw();

           editor.createDevAlert("Deleting post " + id + ".");
           
           return;

       }else{
           // Otherwise, Save the post
           if(thread.posts.modify(id, text) == false){

               // If post isn't found, prevent erasing the content
               editor.createAlert("Post not found. Changes have not been saved.", "high");
           }
           else
           {
                $('textarea').unbind('keydown');

                // Refresh the Post
                var post = thread.posts.get(id);
                editor.draw();

                editor.createDevAlert("Saving post " + post.post_id + ".", "low");
                
           }
       }       
    }

    // Sets the bindings on the general page
    var resetBindings = function(){
        var thread = editor.current();
        $("section").unbind("click");
        $("section").click(openPost);
        $(document).unbind("keypress");
        $(document).bind("keypress", "n", function(){
            editor.createPost();
            return false;
        });

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
               thread.title.set(title);
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
