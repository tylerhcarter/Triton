var TritonSidebar = (function(editor){
    var obj = {};

    obj.init = function(){
        obj.register.notify();
        if(editor.current()){
            overview.init();
        }
        documents.init();
    }

    obj.draw = function(){
        obj.register.notify();
        if(editor.current()){
            overview.draw();
        }
        documents.init();
    }

    obj.register = (function(editor){

        var obj = {};
        var nodes = [];

        obj.register = function(node){
            if(typeof node.update == "function"){
                nodes.push(node);
                return true;
            }else{
                return false;
            }
        }

        obj.notify = function(){
            var len = nodes.length;
            for(var i = 0; i < len; i++){
                nodes[i].update(editor);
            }
        }

        return obj;

    })(editor);

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

    var documents = (function(){

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

            var currentThread = editor.current();
            var currentID;
            if(currentThread != false){
                currentID = currentThread.getID();
            }else{
                currentID = false;
            }
            

            var threads = index.getIndex();
            var len = threads.length;
            for(var i=0; i < len; i++){
                var obj = threads[i];
                if(obj != false){

                    if(obj.id == currentID){
                        $("#document-list").append("<li class=\"active\"><a href=\"#"+obj.id+"\">" + obj.title + "</a></li>")
                    }else{
                        $("#document-list").append("<li><a href=\"#"+obj.id+"\">" + obj.title + "</a></li>")
                    }
                }
            }

            $("#document-list a").click(function(){
               location.hash = $(this).attr("href");
               editor.loadThread($(this).attr("href").substr(1));
               editor.draw();
            });
            
        }



        return obj;

    })();

    return obj;
});

window.TritonNav = (function(sidebar){
    var obj = {};
    var editor = false;

    obj.init = function(){
        sidebar.register.register(obj);
    }

    obj.draw = function(){

        var list = $("<ul />", {
            "id" : "links"
        });

        // Make Basic Menu Items
        $(makeItem("new_doc", "New Document")).appendTo(list);

        // Make Per-Thread Items (if a thread is open)
        if(editor.current()){

            $(makeItem("new_post", "New Post")).appendTo(list);
            $(makeItem("delete_doc", "Delete Document")).appendTo(list);
            
        }

        $("#links").replaceWith(list);
        obj.bind();
    }

    obj.bind = function(){
        var createDoc = function(){
            $t("create doc");
            $(this).click(createDoc);
        };
        $("#new_doc").click(createDoc);

        $("#delete_doc").click(function(){
            $t("delete doc");
            return false;
        });
    }

    function makeItem(id, text){
        var e = $("<li />");
        $("<a />", {
            "id" : id,
            "text" : text
        }).appendTo(e);

        return e;
    }

    obj.update = function(editorObj){
        editor = editorObj;
        obj.draw();
    }

    return obj;
})

