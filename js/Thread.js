window.Triton.Thread = (function(data, encoder){

   var obj = {};
   
   // ID
   obj.getID = function(){
       return data.thread_id;
   }

   // Title
   obj.title = {
       "set" : function(text){
           data.thread_title = text;
           save();
       },
       "get" : function(){
           return data.thread_title;
       }
   }

   obj.posts = {

       "create" : function(text){
           var newPost = {};

           // Make a New ID
           newPost.post_id = window.generateUUID();

           // Add the Text
           newPost.post_content = {
               "html" : text,
               "plain" : text
           };

           data.thread_posts.push(newPost);

           save();
           return newPost.post_id;

       },

       "modify" : function(id, text){
           var posts = data.thread_posts;

           var len = posts.length;
           for(var i=0; i < len; i++){

                if(posts[i].post_id == id){

                    var html = text;
                    var plain = text;

                    var title = getTitle(html);
                    if(title != false){
                        posts[i].post_title = title
                    }else{
                        posts[i].post_title = "";
                    }

                    html = getHTML(html);

                    posts[i].post_content = {
                        "html" : html,
                        "plain" : plain
                    };

                    save();
                    return true;
                }
            }
            return false;
       },

       "remove" : function(id){
           var posts = data.thread_posts;
           var len = posts.length;
           for(var i=0; i < len; i++){
               if(typeof posts[i] == "undefined"){
                   continue;
               }

                if(posts[i].post_id == id){
                    posts.splice(i, 1);
                    save();
                }
            }
            return false;
       },

       "removeAll" : function(){
           data.thread_posts = [];
           save();
       },

       "deleteAll" : function(){
           data.thread_posts = [];
           save();
       },

       "count" : function(){
           return data.thread_posts.length;
       },

       "get" : function(id){
           var posts = data.thread_posts;
           var len = posts.length;
           for(var i=0; i < len; i++){
                if(posts[i].post_id == id){
                    return posts[i];
                }
            }
            return false;
       },

       "getAll" : function(){
           return data.thread_posts;
       }

   }

   function t(name, func){
       return function(){
           console.log("Warning: Calling Deprecated Function (" + name + ")");
           return func.apply(obj, arguments);
       }
   }

   // Aliases
   obj.createPost = t("posts.create", obj.posts.create);
   obj.modifyPost = t("posts.modify", obj.posts.modify);
   obj.remove = t("posts.remove", obj.posts.remove);
   obj.count = t("posts.count", obj.posts.count);
   obj.deleteAll = t("posts.deleteAll", obj.posts.deleteAll);
   obj.getPost = t("posts.get", obj.posts.get);
   obj.getPosts = t("posts.getAll", obj.posts.getAll);
   obj.modifyTitle = t("title.set", obj.title.set);
   obj.getTitle = t("title.get", obj.title.get);

   


   function processForInternalLinks(html) {
        /* Replace Internal Links
         * Syntax:      [text]{Page Name}
         *     Links to another document.
         *            [text]{#Post Title}
         *    Links to a post in the doc.
         */
         var internalRe = /\[(.+?)\]\{(.+?)\}/g;
         return html.replace(internalRe, 
            function(str, text, dest) {
                if (dest.charAt(0) == '#') {
                }
            });
   }

   function getHTML(html){

       // Replace Images
       var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]\.jpg)/ig;
       html = html.replace(exp,"<img src='$1'>");

       html = processForInternalLinks(html);

       var title = getTitle(html);
       if(title != false){
           // break the textblock into an array of lines
            var lines = html.split('\n');

            // remove one line, starting at the first position
            lines.splice(0,1);

            // join the array back into a single string
            var newtext = lines.join('\n');

            html = "###" + title + "\n" + newtext;
       }
       
       // Take what's left and process it as Markdown
       var converter = new Showdown.converter();
       html = converter.makeHtml(html);

       return html;
   }

   function getTitle(html){
        // break the textblock into an array of lines
        var lines = html.split('\n');

        if(lines.length != 1){
            
            // remove one line, starting at the first position
            var title = lines.splice(0,1);
            if(title[0].indexOf(" ") == 0)
            {
                return false;
            }

            // join the array back into a single string
            var newtext = lines.join('\n');

            if(title[0].length < 130){
                return SimpleMD.process(title[0], {no_p_wrap:true});

            }else{
                return false;
                
            }
       } else{
           return false;
       }
   }

   obj.returnData = function(){
       return data;
   }

   function save(){
       encoder.sleep(data.thread_id, obj);
   }

   return obj;

});
