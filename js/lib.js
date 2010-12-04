function assert(testPassed, testName){
    if(testPassed == false){
        if(typeof testName == "undefined"){
            console.log("Test Failed");
        }else{
            console.log("Test [" + testName + "] Failed");
        }
    }
}

function pp(obj, indent)
{
  var result = "";
  if (indent == null) indent = "";

  for (var property in obj)
  {
    var value = obj[property];
    if (typeof value == 'string')
      value = "'" + value + "'";
    else if (typeof value == 'object')
    {
      if (value instanceof Array)
      {
        // Just let JS convert the Array to a string!
        value = "[ " + value + " ]";
      }
      else
      {
        // Recursive dump
        // (replace "  " by "\t" or something else if you prefer)
        var od = pp(value, indent + "  ");
        // If you like { on the same line as the key
        //value = "{\n" + od + "\n" + indent + "}";
        // If you prefer { and } to be aligned
        value = "\n" + indent + "{\n" + od + "\n" + indent + "}";
      }
    }
    result += indent + "'" + property + "' : " + value + ",\n";
  }
  return result.replace(/,\n$/, "");
}

function threadpp(thread){
    $("#object").text(JSON.stringify(thread.returnData(), null, "   "));
}
// Generates a Unique ID
window.generateUUID = (function(){
      function S4() {
           return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        }
        return function(){
            return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
        }
})();

window.Notifier = (function(){

        var obj = {};
        var nodes = [];

        obj.register = function(node){
            nodes.push(node);
        }

        obj.notify = function(method, val){
            var len = nodes.length;
            for(var i = 0; i < len; i++){
                if(typeof nodes[i][method] == "function"){
                    nodes[i][method](val);
                }
            }
        }

        return obj;

});

function Error(message){

    var obj = {};

    obj.getMessage = function(){
        return message;
    }

    return obj;

}