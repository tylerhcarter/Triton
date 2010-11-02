window.Triton.TritonPosts = (function(){

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
            $("#welcome").hide();
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

            var keywords = thread.keywords.getAll();
            var len = keywords.length;
            for(i = 0; i < len; i++){
                $(div).append("<p>" + keywords[i].name + ": " + keywords[i].definition + "</p>");
            }

            $("<div />", {
                "class" : "bottomWash",
                "html" : "&nbsp;"
            }).appendTo(div);

            
            $("#posts").replaceWith(div);
        };

        function drawWelcome(){
            var div = $("<div />",{
                "id" : "posts"
            });
            $("#posts").replaceWith(div);
            $("#welcome").show();
        };

        return obj;
});