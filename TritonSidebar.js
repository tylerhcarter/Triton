var TritonSidebar = (function(thread){
    var obj = {};

    obj.init = function(){
        overview.init();
    }

    var overview = (function(){
        var obj = {};

        obj.init = function(){
            loadThreads();
        }

        var loadThreads = function(){
            var len;
            var titles = [];

            var posts = thread.getPosts();
            var postsLength = posts.length;
            for(var i=0; i < postsLength; i++){
                if(posts[i].post_title != ""){
                    titles.push({
                        "title" : posts[i].post_title,
                        "id" : posts[i].post_id
                    });
                }
            }

            if(titles.length > 0){

                var html = $("<ul />",{
                    "id" : "overview"
                });

                var titlesLength = titles.length;
                for(var i=0; i < titlesLength; i++){
                    $("<li />",{
                        html: $("<a \>", {
                            "href" : "#" + titles[i].id,
                            "text" : titles[i].title
                        })
                    }).appendTo(html);
                }

                $("#overview-list").replaceWith(html);

            }
        }

        return obj;
    })();

    return obj;
});