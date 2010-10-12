var Thread = (function(data){

   var obj = {};
   var data = data;

   obj.createPost = function(text){
       
       var newPost = {};

       // Make a New ID
       newPost.post_id = window.generateUUID();

       // Add the Text
       newPost.post_content = {
           "html" : text,
           "plain" : text
       };

       data.thread_posts.push(newPost);

       return newPost.post_id;

   }

   obj.modifyPost = function(id, text){
       var posts = data.thread_posts;

       var len = posts.length;
       for(var i=0; i < len; i++){

            if(posts[i].post_id == id){

                var html = text;
                var plain = text;

                html = getHTML(html);

                posts[i].post_content = {
                    "html" : html,
                    "plain" : plain
                };
                //console.log("Item Found (Searched: " + len +")");
                return true;
            }
        }
        //console.log("Item Not Found (Searched: " + len +")");
        return false;
   }

   function getHTML(html){

        // Replace Images
        var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]\.jpg)/ig;
        html = html.replace(exp,"<img src='$1'>");

       // break the textblock into an array of lines
        var lines = html.split('\n');

        if(lines.length != 1){
            // remove one line, starting at the first position
            var first = lines.splice(0,1);
            // join the array back into a single string
            var newtext = lines.join('\n');

            console.log(first[0].length);

            if(first[0].length < 130){
                html = "<h4>" + first[0] + "</h4>" + newtext;
            }
       }

       // Change newlines to <br>
       var regX = /\n/gi ;
       html = html.replace(regX, "<br /> \n");


       return html;
   }

   obj.remove = function(id){
       var posts = data.thread_posts;
       var len = posts.length;
       for(var i=0; i < len; i++){
            if(posts[i].post_id == id){
                posts.splice(i, 1);
            }
        }
        return false;
   }

   obj.deleteAll = function(){
       data.thread_posts = [];
   }

   obj.getPost = function(id){
       var posts = data.thread_posts;
       var len = posts.length;
       for(var i=0; i < len; i++){
            if(posts[i].post_id == id){
                return posts[i];
            }
        }
        return false;
   }

   obj.getPosts = function(){
       return data.thread_posts;
   }

   obj.returnData = function(){
       return data;
   }

   return obj;

});