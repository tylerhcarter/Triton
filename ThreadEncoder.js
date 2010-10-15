var Encoder = (function(localStorage){

    var obj = {};

    obj.create = function(){

        var baseObj = {
            "thread_id" : window.generateUUID(),
            "thread_title" : "Thread Title",
            "thread_posts" : []
        };

        return window.Thread(baseObj, obj);

    }

    obj.restore = function(key){
        return window.Thread(load(key), obj);
    }

    obj.sleep = function(key, thread){
        save(key, thread);
    }

    function load(key){
        return JSON.parse(localStorage.getItem(key));
    }

    function save(key, thread){
        console.log("Saved")
        localStorage.setItem(key, JSON.stringify(thread.returnData()));
    }


    return obj;

});