window.Triton.ThreadIndex = (function(storage, thread_key){
    var obj = {};

    if(typeof localStorage == "undefined"){
        throw new Error("Unable to access localStorage.");
    }

    if(typeof thread_key == "undefined"){
        thread_key = "thread_index"
    }
    
    var encoder = window.Triton.Encoder(storage);

    var data;
    
    obj.init = function(){
        // Load the Data
        load();

        // Update the Data
        refreshData();
    }

    obj.load = function(){
        load();
    }
    obj.save = function(){
        save();
    }

    function load(){
        data = storage.load(thread_key);
        
        if(!data){
            data = [];
            save();
        }
    }

    function save(){
        storage.save(thread_key, data);
    }

    obj.getIndex = function(){
        return data;
    }

    obj.addIndex = function(thread){
        data.push({
            "id" : thread.getID(),
            "title" : thread.getTitle()
        });
        save();
    }

    obj.deleteIndex = function(id){

        // Check if the thread was passed instead
        if(typeof id.returnData == "function"){
            id = id.getID();
        }

        var len = data.length;
        for(var i=0; i < len; i++){
            if(data[i].id == id){
                data.splice(i, 1);
                save();
                //console.log("Deleteing");
                return true;
            }
        }
        
        return false;
    }

    obj.deleteAll = function(){
        data = [];
        save();
    }

    obj.refresh = function(){
        refreshData();
    }

    function refreshData(){

        var threads = obj.getIndex();
        var len = threads.length;
        for(var i=0; i < len; i++){

            var current = threads[i];
            var thread = encoder.load(current.id);
            if(thread == false){
                //obj.deleteIndex(current.id);
                continue;
            }

            if(current.title != thread.title.get()){
                threads[i].title = thread.title.get();
            }
            
            if(typeof thread.getUpdated() === "undefined"){
                thread.touch();
            }

            if(current.updated != thread.getUpdated()){
                current.updated = thread.getUpdated();
            }

            if(current.post_count != thread.posts.count()){
                current.post_count = thread.posts.count()
            }

        }

        data = threads;

    };

    return obj;
});