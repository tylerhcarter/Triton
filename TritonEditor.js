var TritonEditor = (function(localStorage, jQuery){
    var obj = {};
    var $ = jQuery;

    obj.init = function(){
        obj.bind();
    };

    obj.bind = function(){
        $("section").click(function(){
            var data = localStorage.get($(this).attr("id"));

            var newHTML = createEdit(data);
            $(this).replaceWith(newHTML);
            $("#" + $(this).attr("id") + " textarea").focus();
            $("#" + $(this).attr("id") + " textarea").blur(function(){

                data.content.html = $(this).val();

                var newHTML = createView(data);
                $(this).replaceWith(newHTML);
                obj.bind();
            })
        });
    }

    function createEdit(data){
        var newHTML = "<section id=\""+data.id+"\">";
        newHTML += "<textarea>" + data.content.plain + "</textarea>";
        newHTML += "</textarea>"

        return newHTML;
    }

    function createView(data){
        var newHTML = data.content.html;
        return newHTML
    }

    return obj;
});