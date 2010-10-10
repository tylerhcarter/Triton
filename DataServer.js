var DataServer = (function(localSever){
    var obj = {};

    var data = [
    {
        id: "GUID121",
        title: "An Inspirational Title",
        owner: "USERUGID123",
        content: {
            plain: "An Inspirational Title",
            html: "<h1>An Inspirational Title</h1>"
        }
    },
    {
        id: "GUID122",
        title: "An Inspirational Title2",
        owner: "USERUGID123",
        content: {
            plain: "An Inspirational Title",
            html: "<h1>An Inspirational Title</h1>"
        }
    },
    {
        id: "GUID123",
        title: "An Inspirational Title3",
        owner: "USERUGID123",
        content: {
            plain: "An Inspirational Title",
            html: "<h1>An Inspirational Title</h1>"
        }
    },
    {
        id: "GUID124",
        title: "An Inspirational Title4",
        owner: "USERUGID123",
        content: {
            plain: "An Inspirational Title",
            html: "<h1>An Inspirational Title</h1>"
        }
    }
    ];

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

    obj.set = function(data){

      localServer.set("posts", data);

    };

    return obj;
});