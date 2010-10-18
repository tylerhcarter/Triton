var TritonSidebar = (function(editor){
    var obj = {};

    obj.init = function(){

        if(editor.current()){
            overview.init();
        }
        nav.init();
    }

    obj.draw = function(){
        if(editor.current()){
            overview.draw();
        }
        nav.init();
    }

    var overview = (function(){
        var obj = {};

        obj.init = function(){
            loadThreads();
        }

        obj.draw = function(){
            loadThreads();
        }

        var loadThreads = function(){
            var len;
            var titles = [];
            var thread = editor.current();
            
            var posts = thread.getPosts();
            var postsLength = posts.length;
            for(var i=0; i < postsLength; i++){
                if(posts[i].post_title != "" && posts[i].post_title != null){
                    titles.push({
                        "title" : posts[i].post_title,
                        "id" : posts[i].post_id
                    });
                }
            }

            if(titles.length > 0){
                
                var html = $("<div />", {
                    "id" : "overview"
                });

                $("<header />", {
                    "html" : "Overview"
                }).appendTo(html);

                var list = $("<ul />",{
                    "id" : "overview-list"
                });

                var titlesLength = titles.length;
                for(var i=0; i < titlesLength; i++){
                    $("<li />",{
                        html: $("<a \>", {
                            "href" : "#" + titles[i].id,
                            "text" : titles[i].title
                        })
                    }).appendTo(list);
                }

                $(list).appendTo(html);

                $("#overview").replaceWith(html);

            }
            else
            {
                $("#overview").replaceWith($("<div />", {
                    "id" : "overview"
                }));
            }
        }

        return obj;
    })();

    var nav = (function(){

        var obj = {};

        obj.init = function(){
            draw();
        }

        obj.draw = function(){
            draw();
        }

        var draw = function(){
            var encoder = window.Encoder(window.localStorage);

            $("#document-list").html("");

            var index = editor.getIndex();
            index.refresh();

            var threads = index.getIndex();
            var len = threads.length;
            for(var i=0; i < len; i++){
                var obj = threads[i];
                if(obj != false){
                    $("#document-list").append("<li><a href=\"#"+obj.id+"\">" + obj.title + "</a></li>")
                }
            }

            $("#document-list a").click(function(){
               location.hash = $(this).attr("href");
               location.reload(true);
            });
            
        }



        return obj;

    })();

    return obj;
});