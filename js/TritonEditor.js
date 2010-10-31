var TritonEditor = (function(window){
    var obj = {};
    var ui;
    var thread;
    var sidebar;

    // Construct base objects
    assert(typeof ThreadIndex != "undefined", "TritonEditor.js->TritonEditor(); ThreadIndex not found.")
    var index;
    index = ThreadIndex(window.localStorage);

    assert(typeof ThreadManager != "undefined", "TritonEditor.js->TritonEditor(); ThreadManager not found.")
    var manager;
    manager = ThreadManager(window.localStorage);

    assert(typeof Notifier != "undefined", "TritonEditor.js->TritonEditor(); Notifier not found.")
    var notifier = Notifier();

    assert(typeof TritonPosts != "undefined", "TritonEditor.js->TritonEditor(); TritonPosts not found.");
    var posts = TritonPosts();

    // Initializes the Editor
    obj.init = function(){

        // Initialize the thread system
        index.init();
        manager.init();

        // Create UI Object
        ui = TritonKUI(obj);

        // Create Sidebar Object
        sidebar = TritonSidebar(obj);
        TritonNav(sidebar).init();
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
    }

    obj.getThread = function(){
        return thread;
    }

    obj.current = function(){
        if(typeof thread.getID == "function"){
            return thread;
        }else{
            return false;
        }
    }

    obj.setThread = function(newThread){
        thread = newThread;
    }

    obj.loadThread = function(id){
        thread = manager.getThread(id);
    }

    obj.clearThread = function(){
        thread = false;
    }

    obj.getManager = function(){
        return manager;
    }

    obj.getEncoder = function(){
        return manager.getEncoder();
    }

    obj.getIndex = function(){
        return manager.getIndex();
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


    // Creates a new post on a thread
    // TODO: Move tot he KUI 
    obj.createPost = function(){

        // Leave any currently open textareas
        $('textarea').blur();

        // Create the new post and save
        var id = thread.createPost("");

        // Redraw the window
        obj.draw();

        // Select the new textarea
        $("#" + id).click();
    }

    
    return obj;
});