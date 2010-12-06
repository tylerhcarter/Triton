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
        $(document).unbind("keydown");
        $(document).bind("keypress", "n", function(){
            editor.createPost();
            return false;
        });

        // Inter-document links
        $("section a[href^='#']").click(function(ev) {
            var href = this.href.split('#')[1];
            var components = href.split('/');

            // Go to the right thread
            editor.loadThread(components[0]);
            editor.draw();

            // Now to correct post
            if (components.length > 1)
                $('body').animate({scrollTop: $('#'+components[1]).position().top}, 'slow');

            location.hash = href;
        });

        // Keyboard navigation
        $(document).keydown(function(ev) {
            // First, check the focus isn't actually in a text field
            if (document.activeElement != document.body)
                return true;

            // --- Navigation functions ---
            // Up = 38, Down = 40
            var initialSelection = function() {
                ev.preventDefault();

                if (!$('.selected').length) {
                    $('section:first').addClass('selected');
                    return true;
                }
                return false;
            };

            if (ev.which == 38) {
                if (initialSelection()) return false;

                var before = $('section.selected').removeClass('selected').prevAll('section');
                $('section.selected').removeClass('selected');

                if (before.length)
                    before.eq(0).addClass('selected');
                else
                    $('section:last').addClass('selected');
            }
            else if (ev.which == 40) {
                if (initialSelection()) return false;

                var after = $('section.selected').nextAll('section');
                $('section.selected').removeClass('selected');
                console.log(after);

                console.log(after.length);

                if (after.length)
                    after.eq(0).addClass('selected');
                else
                    $('section:first').addClass('selected');
            }
            
            // --- Manipulation ---
            else if (ev.which == 46) { // Del
                thread.posts.remove($('section.selected').attr('id'));
                editor.draw();

                ev.preventDefault();
            }
            else if (ev.which == 13) { // Return
                openPost.call($('section.selected')[0]);
                ev.preventDefault();
            }
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
