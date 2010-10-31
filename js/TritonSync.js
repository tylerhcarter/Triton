var TritonSync = (function(window){
    var obj = {};

    var console = window.console;
    var $ = window.$;
    var sendData = [];
    var editor;

    obj.start = function(editorObj){
        editor = editorObj;

        var index = editor.getIndex();
        var manager = editor.getManager();

        var threads = index.getIndex();

        var len = threads.length;
        for(var i = 0; i < len; i++){

            var thread = manager.getThread(threads[i].id)
            sendData.push(thread.returnData());
            
        }

        $.getJSON("/triton/sync/index.php?action=start", loadSessionKey);
    }

    var session_key;
    var loadSessionKey = function(data){
        console.log("Recieved User Key: " + data.session_key);
        session_key = data.session_key;
        startSaveData();
    }

    var startSaveData = function(){
        var url = "/triton/sync/index.php?action=save&session_key=" + session_key;

        var len = sendData.length;
        for(var i = 0; i < len; i++){
            $.ajax({
                "success" : saveDataHandler,
                "url" : url,
                "type" : "POST",
                "dataType" : "json",
                "data" : sendData[i]
            });
        }
    }

    var saveDataHandler = function(data){
        console.log("Status: " + data.status_code + "/" + data.status);
        console.log("Recieved: " + data["data"]);
    }



    return obj;
});