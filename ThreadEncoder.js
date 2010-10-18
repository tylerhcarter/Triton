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
        var baseObj = load(key);
        if(baseObj == false){
            return false;
        }else{
            return window.Thread(baseObj, obj);
        }
    }

    obj.sleep = function(key, thread){
        save(key, thread);
    }

    obj.remove = function(key){
        localStorage.removeItem(key);
    }

    function load(key){
        if(localStorage.getItem(key)){
            return JSON.parse(localStorage.getItem(key));
        }else{
            return false;
        }
    }

    function save(key, thread){
        localStorage.setItem(key, JSON.stringify(thread.returnData()));
    }


    return obj;

});