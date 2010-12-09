window.Triton.Encoder = (function(storage){

    var obj = {};

    obj.create = function(){

        var baseObj = {
            "thread_id" : window.generateUUID(),
            "thread_title" : "Thread Title",
            "thread_posts" : []
        };

        return window.Triton.Thread(baseObj, obj);

    }

    obj.load = function(key){

        var result = storage.load(key);

        // Check if the thread exists
        if(!result){

            return false
            
        }else{

            return window.Triton.Thread(result, obj);
            
        }
        
    }

    obj.save = function(key, thread){

        var threadData = thread.returnData();
        storage.save(key, threadData);

    }

    obj.remove = function(key){

        storage.remove(key);
        
    }


    return obj;

});