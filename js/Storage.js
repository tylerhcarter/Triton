window.Triton.Storage = (function(window){

    var obj = {};

    if(typeof window.localStorage == "undefined"){
        throw new Error("Unable to access localStorage.");
    }

    if(typeof window.JSON == "undefined"){
        throw new Error("Unable to access JSON parser.");
    }

    var localStorage = window.localStorage;

    obj.load = function(key){

        var result = localStorage.getItem(key);

        // Check if anything was returned
        if(!result){
            return false;
        }

        // Check if the data is an object/array
        if(isJSON(result)){

            // Try to parse the object
            try{

                var data = JSON.parse(result);
                return data;

            }
            catch(e){

                // The data wasn't JSON
                // Return it as a string
                return result;

            }

        }

        return result;

    }

    function isJSON(data){

        if(data.substr(0,1) == "{" && data.substr(data.length-1, data.length) == "}"){
            return true;
        }

        if((data.substr(0,1) == "[" && data.substr(data.length-1, data.length) == "]")){
            return true;
        }

        return false;
    }

    obj.save = function(key, data){

        if(typeof data == "string"  || typeof data == "number"){
            
            localStorage.setItem(key, data);
            
        }
        else{

            var json = JSON.stringify(data);
            localStorage.setItem(key, json);

        }

    }

    obj.remove = function(key){

        localStorage.removeItem(key);

    }


    return obj;

});