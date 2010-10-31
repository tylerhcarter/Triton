window.Triton.TritonEditor = (function(window){
    var obj = {};
    var ui;
    var thread;
    var sidebar;
    var $t = window.Triton;

    // Construct base objects
    assert(typeof $t.ThreadIndex != "undefined", "TritonEditor.js->TritonEditor(); ThreadIndex not found.")
    var index;
    index = $t.ThreadIndex(window.localStorage);

    assert(typeof $t.ThreadManager != "undefined", "TritonEditor.js->TritonEditor(); ThreadManager not found.")
    var manager;
    manager = $t.ThreadManager(window.localStorage);

    assert(typeof Notifier != "undefined", "TritonEditor.js->TritonEditor(); Notifier not found.")
    var notifier = Notifier();

    assert(typeof $t.TritonPosts != "undefined", "TritonEditor.js->TritonEditor(); TritonPosts not found.");
    var posts = $t.TritonPosts();

    // Check for other depedant objects
    var requiredObjs = [
        "Thread",
        "Encoder",
        "ThreadIndex",
        "ThreadManager",
        "TritonKUI",
        "TritonSidebar"
    ];
    var len = requiredObjs.length;
    for(var i = 0; i < len; i++){
        assert(typeof $t[requiredObjs[i]] != "undefined", "TritonEditor.js->TritonEditor(); "+ requiredObjs[i] +" not found.");
    }

    // Initializes the Editor
    obj.init = function(){

        // Initialize the thread system
        index.init();
        manager.init();

        // Create UI Object
        ui = $t.TritonKUI(obj);

        // Create Sidebar Object
        sidebar = $t.TritonSidebar(obj);
        $t.TritonNav(sidebar).init();
        notifier.register(sidebar);
        
        notifier.register(posts);
        
        // Get the current thread
        thread = loadCurrentThread();

        // Draw the Window
        obj.draw();
    }

    // Draws the HTML
    obj.draw = function(bindEvents, callback){

        if(typeof bindEvents == "undefined"){
            bindEvents = true;
        }

        // Notify the other modules that something has changed
        notifier.notify("draw", obj);

        // Allows for disabling the default UI
        // TODO: This should really be triggered by the posts module
        if(bindEvents == true){
            ui.init();
        }

        if(typeof callback == "function"){
            callback();
        }

        return true;
    }

    
    function loadCurrentThread(){

        // Get the current post ID
        var hash = window.location.hash.substr(1);

        // Check if a thread with this ID exists
        if(typeof window.localStorage.getItem(hash) == "string"){
            return manager.getThread(hash);
        }else{
            return false;
        }
    }

    obj.getThread = function(){ return thread; }
    obj.current = function(){ return thread; }
    obj.loadThread = function(id){
        thread = manager.getThread(id);
    }
    obj.setThread = function(newThread){
        thread = newThread;
    }
    obj.clearThread = function(){
        thread = false;
    }

    // Accessors
    obj.getManager = function(){ return manager;}
    obj.getEncoder = function(){ return manager.getEncoder();}
    obj.getIndex = function(){ return manager.getIndex();}
    
    return obj;
});