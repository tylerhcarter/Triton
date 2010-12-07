window.Triton.Parser = (function(window){

    var obj = {};

    obj.parse = function(text){
        var textByLines;

        // Replace URLs with .jpg endings with image tags
        // Temporarily disabled
        //text = replaceImages(text);

        // Disabled Temporarily
        text = replaceInternalLinks(text);

        // Formats the first line as a title
        text = replaceTitle(text);

        // Add 2 spaces at the end of lines that contain content (to make Markdown break the line)
        text = fixLineEndings(text);

        // Parse through markdown
        var converter = new Showdown.converter();
        text = converter.makeHtml(text);

        return text;
    }

    function replaceImages(text){
        var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]\.jpg)/ig;
        text = text.replace(exp,"<img src='$1'>");
        return text;
    }

    function replaceTitle(text){
       var lines;
       
       var title = findTitle(text);
       if(title != false){
           // break the textblock into an array of lines
            lines = text.split('\n');

            // remove one line, starting at the first position
            lines.splice(0,1);

            // join the array back into a single string
            var newtext = lines.join('\n');
            text = "###" + title + "\n" + newtext;
            return text;
       }else{
           return text;
       }

    }

    function findTitle(text){
        // break the textblock into an array of lines
        var lines = text.split('\n');

       if(lines.length != 1){

            // remove one line, starting at the first position
            var title = lines.splice(0,1);
            if(title[0].indexOf("  ") == 0)
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

    function fixLineEndings(text){
        var lines;
        
        // Add 2 spaces to the end of all lines with text
       lines = text.split('\n');

       var num = lines.length;
       for(var i = 0; i < num; i++){
           lines[i] = lines[i] + "  ";
       }

       text = lines.join('\n');
       return text;
    }

    function replaceInternalLinks(html) {
        /* Replace Internal Links
        * Syntax:      [text]{Page Name}
        *     Links to another document.
        *            [text]{#Post Title}
        *    Links to a post in the doc.
        */
        var internalRe = /\[(.+?)\]\{(.+?)\}/g;
        return html.replace(internalRe,
            function(str, text, dest) {
                var invalid = false, thread_id = '', post_id = '', title;

                if (dest.charAt(0) == '#') {
                    var currentThread = window.Triton.editor.current();
                    thread_id = currentThread.getID();

                    // Search the current thread for a post with that name
                    var posts = currentThread.posts.getAll();
                    dest = dest.substring(1);

                    console.log(posts.length);

                    for (var i = 0; i < posts.length; i++) {
                        var post = posts[i];

                        // Do an exact name search
                        if (post.post_title == dest)
                            post_id = post.post_id;

                        // Otherwise check if it begins with the name
                        else if (post.post_title.indexOf(dest) == 0)
                            post_id = post.post_id;

                        if(post_id != ""){
                            title = post.post_title;
                            break;
                        }

                    }
                }
                else {
                    // Search the thread list for that thread's GUID
                    var index = window.Triton.ThreadIndex(window.localStorage);
                    index.init();
                    var threads = index.getIndex();

                    for (var i = 0; i < threads.length; i++) {
                        var this_thread = threads[i];

                        if (this_thread.title === dest){
                            thread_id = this_thread.id;
                            title = this_thread.title;
                        }
                            
                    }
                }

                window.console.log("POST: " + post_id + " THREAD:" + thread_id);

                // URLs take the form THREAD-ID/POST-ID. If no specific post is to be linked
                // to, the /POST-ID is omitted completely.

                var href = '#' + thread_id;
                if (post_id != '')
                href += '/' + post_id;

                var htmlStr = '<a href="' + href + '"' + (invalid ? 'class="invalid_link"' : '') + ' title=\"'+ title+'\">' + text + '</a>';
                return htmlStr;
            }
        );
    }


    return obj;

})(window);