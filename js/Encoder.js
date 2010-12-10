window.Triton.Encoder = (function(storage){

    var obj = {};

    obj.create = function(){

        var baseObj = {
            "thread_id" : window.generateUUID(),
            "thread_title" : "Thread Title",
            "thread_posts" : []
        };

        return window.Triton.Thread(baseObj, storage);

    }

    obj.load = function(key){

        var result = storage.load(key);

        // Check if the thread exists
        if(result){

            return window.Triton.Thread(result, storage);
            
        }

        return false;
        
    }

    obj.remove = function(key){

        storage.remove(key);
        
    }


    return obj;

});