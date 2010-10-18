var ThreadManager = (function(localStorage){
    var obj = {};
    var index;
    var encoder;

    // Accessors
    obj.getIndex = function(){ return index; }
    obj.getEncoder = function(){ return encoder; }

    obj.init = function(){

        // Create the Thread Index
        index = window.ThreadIndex(localStorage);
        index.init();

        // Create the Encoder
        encoder = window.Encoder(localStorage);

    }

    obj.createThread = function(){

        // Create the Post
        var thread = encoder.create();

        // Add it to the index
        index.addIndex(thread);
        
        return thread;

    }

    obj.removeThread = function(id){

        // Check if the thread was passed instead
        if(typeof id.returnData == "function"){
            id = id.getID();
        }

        // Delete the thread from the index
        index.deleteIndex(id);

        // Delete the thread from localStorage
        encoder.remove(id);

        return true;
    }

    obj.getThread = function(id){

        return encoder.restore(id);
        
    }

    return obj;
});