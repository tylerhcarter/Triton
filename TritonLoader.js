var TritonLoader = (function(dataStorage, editor){
    var obj = {};
    var dataStore = dataStorage;
    var editor = editor;

    var messageBox = document.getElementById('log');

    obj.init = function(){
        var data = dataStore.getAll();

        var l = data.length;
        for(i=0; i < l; i++){
            messageBox.innerHTML += getHTML(data[i]);
        }

        function getHTML(dataObj){
            var html = '<section id="'+dataObj.id+'">';
            html += dataObj.content.html;
            html += '</section>';

            return html;
        }

        editor.init();
    }

    return obj;
});