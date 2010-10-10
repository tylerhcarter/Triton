var DataServer = (function(localServer, JSON){
    var obj = {};
    var data;
    load();

    obj.get = function(id){

        var l = data.length;
        for(var i=0; i < l; i++){

            if(data[i].id == id){
                return data[i];
            }
        }

        return false;

    }

    obj.getAll = function(){
        return data;
    }

    obj.set = function(id, newData){
        set(id, newData);
        save();
    };

    function set(id, newData){

        console.log("Setting Entry: " + id);

        // First Check for Existing Entry
        var l = data.length;
        for(var i=0; i < l; i++){

            if(data[i].id == id){
                data[i] = newData;
                console.log("Modifyng Entry: " + id);
                return;
            }
        }

        // Create a new entry
        data.push(newData);
        console.log("Creating Entry: " + id);
        return;
    }

    function save(){
        console.log("Saving " + data.length + " Entries");
        localServer.set("posts", JSON.stringify(data));
    }

    function load(){
        data = JSON.parse(localServer.get('posts'));
        console.log("Loading " + data.length + " Entries");
        save();
    }

    return obj;
});