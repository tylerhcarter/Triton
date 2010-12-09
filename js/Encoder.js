window.Triton.Encoder = (function(localStorage){

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

        var result = localStorage.getItem(key)

        // Check if the thread exists
        if(!result){

            return false
            
        }else{

            result = JSON.parse(result);
            return window.Triton.Thread(result, obj);
            
        }
        
    }

    obj.save = function(key, thread){

        var threadData = thread.returnData();
        var threadString = JSON.stringify(threadData);

        localStorage.setItem(key, threadString);

    }

    obj.remove = function(key){

        localStorage.removeItem(key);
        
    }


    return obj;

});