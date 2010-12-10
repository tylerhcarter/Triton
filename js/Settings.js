window.Triton.Settings = (function(window){
    var obj = {};
    var $t = window.Triton;
    var data;

    obj.init = function(){
        load();

        $t.compact = data.compact;

        if($t.debug != data.debug){
            $t.debug = data.debug;
        }
        
    }

    obj.set = function(key, value){
        data[key] = value;
        save();
    }
    
    function load(){
        var result = window.localStorage.getItem("settings");
        if(result == null){
            data = {
                "compact" : false,
                "debug" : false
            };
            save();
        }else{
            data = JSON.parse(window.localStorage.getItem("settings"));
        }
    }

    function save(){
        window.localStorage.setItem("settings" , JSON.stringify(data));
    }
    

    return obj;
});