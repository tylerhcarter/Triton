/*
 * This object will be responsible for syncing the local data store
 * and the server.
 *
 * All data should be stored in the localStorage, and then updates
 * to to the data should be sent to the server.
 */
var LocalServer = (function(localStorage){
    var obj = {};

    /*
     * Checks the status of the connection.
     * Should ping the server every so often
     * and update the status if it changes
     */
    var statusChecker = (function(){

        console.log("Created");

        var obj = {};
        var status = false;
        var timer = false;

        // Send an AJAX request to the server
        // If after 3 tries it is unavailable, change to offline mode
        var checkStatus = function(){
            console.log("Check");
        }

        obj.init = function(){
            // Start Timer
            timer = setInterval(checkStatus, 2000);
        };

        obj.getStatus = function(){
            return status;
        };

        obj.check = function(){
            alert("Not Implemented");
        };

        return obj;

    })();

    obj.set = function(key, value){
        localStorage.setItem(key, value);
    };

    obj.get = function(key){
        return localStorage.getItem(key);
    }

    statusChecker.init();

    return obj;
});
window.LocalServer = LocalServer;