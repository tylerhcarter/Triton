window.Triton.Test.Encoder = (function(localStorage){

    var obj = {};

    obj.create = function(){

        var baseObj = {
            "thread_id" : window.generateUUID(),
            "thread_title" : "Thread Title",
            "thread_posts" : []
        };

        return window.Triton.Thread(baseObj, obj);

    }

    obj.restore = function(key){
        return obj.create();
    }

    obj.sleep = function(key, thread){
        return;
    }

    obj.remove = function(key){
        localStorage.removeItem(key);
    }

    return obj;

});