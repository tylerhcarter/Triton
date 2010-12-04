window.Triton.Thread = (function(data, encoder){

   var obj = {};
   
   obj.modifyTitle = function(text){
       data.thread_title = text;
       save();
   }

   obj.getTitle = function(){
       return data.thread_title;
   }

   var _getSlug = function(){
	   return obj.getTitle().replace(/\W/gi, '-');
   };
   obj.getSlug = _getSlug;

   obj.getID = function(){
       return data.thread_id;
   }

   obj.createPost = function(text){
       
       var newPost = {};

       // Make a New ID
       newPost.post_id = window.generateUUID();
	   newPost.thread_id = obj.getID();

       // Add the Text
       newPost.post_content = {
           "html" : text,
           "plain" : text
       };

       data.thread_posts.push(newPost);
       
       save();
       return newPost.post_id;

   }

   obj.modifyPost = function(id, text){
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
                //console.log("Item Found (Searched: " + len +")");

                save();
                return true;
            }
        }
        //console.log("Item Not Found (Searched: " + len +")");
        return false;
   }

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
				var invalid = false, thread_id = data.thread_id, post_id = '';

				var index = window.Triton.ThreadIndex(window.localStorage);
				index.init();
				var threads = index.getIndex();

                if (dest.charAt(0) == '#') {
					// Search the current thread for the post with that name
					var posts = data.thread_posts;
					dest = dest.substring(1);
					
					for (var i = 0; i < posts.length; i++) {
						var post = posts[i];

						if (post.post_title == dest)
							post_id = post.post_id;
					}
				}
				else {
					// Search the thread list for that thread's GUID
					for (var i = 0; i < threads.length; i++) {
						var this_thread = threads[i];
						
						if (this_thread.title === dest)
							thread_id = this_thread.id;
					}
				}

				// URLs take the form THREAD-ID/POST-ID. If no specific post is to be linked
				// to, the /POST-ID is omitted completely.

				var href = '#' + thread_id;
				if (post_id != '')
					href += '/' + post_id;

				var htmlStr = '<a href="' + href + '"' + (invalid ? 'class="invalid_link"' : '') + '>' + text + '</a>';
				return htmlStr;
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

   obj.remove = function(id){
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
   }

   obj.count = function(){
       return data.thread_posts.length;
   }

   obj.deleteAll = function(){
       data.thread_posts = [];
       save();
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

   function save(){
       encoder.sleep(data.thread_id, obj);
   }

   return obj;

});
