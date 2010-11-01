window.Triton.TritonKeywords = (function(editor){

    var obj = {};

    obj.init = function(){
        
    }

    obj.parse = function(thread){

        // First get the content
        var contents = thread.getPosts();

        thread.keywords.clear();

        // Go through each of the posts
        var len = contents.length;
        for(var i = 0; i < len; i++){
            var current = contents[i].post_content.plain;

            var regex = /([a-zA-Z0-9]{1,}):[\s]{0,}([^\n]{1,})*/gim;
            var matches = current.match(regex);

            if(matches != null){
                
                len = matches.length;
                console.log(len);
                for(var l = 0; l < len; l = l+1){
                    var string = matches[l];
                    var parts = string.split(":");
                    thread.keywords.add(parts[0], parts[1]);
                    console.log(l);
                }
            }
            
        }

        console.log("Finished");
    }

    return obj;

})