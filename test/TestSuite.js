/*
 * Triton Test Suite
 */


window.TestSuite = (function(window){

    function log(message){
        console.log(message);
    }

    /*
     * Thread Testing
     */
    var threads = function(){

        var mockEncoder = window.Triton.Test.Encoder();

        var data = {
                    "thread_id" : "testID",
                    "thread_title" : "Test Thread Title",
                    "thread_posts" : []
                    };
        var thread = window.Triton.Thread(data, mockEncoder);

        // Check Basic Information Functions
        if(thread.getID() != data.thread_id){
            log("Thread ID from thread.getID() does not match");
        }
        if(thread.getTitle() != data.thread_title){
            log("Thread Title from thread.getTitle() does not match");
        }
        if(thread.getPosts().length != data.thread_posts.length){
            log("Thread Posts count from thread.getPosts() does not match");
        }
        if(thread.count() != data.thread_posts.length){
            log("Thread Posts count from thread.count() does not match");
        }

        // Retrieve the data and verify it is correct
        var objData = thread.returnData();
        if(objData.thread_id != data.thread_id){
            log("Thread ID from thread.returnData() does not match");
        }

        if(objData.thread_title != data.thread_title){
            log("Thread Title from thread.returnData() does not match");
        }

        // Create a post and chcek changes to data
        var testPostContent = "Test Post Content";
        var newPostId = thread.createPost(testPostContent);
        if(thread.getPosts().length != data.thread_posts.length){
            log("Thread Posts count from thread.getPosts() after creating a post does not match");
        }
        if(thread.count() != data.thread_posts.length){
            log("Thread Posts count from thread.count() after creating a post does not match");
        }

        // Check that the newly create post has the right content
        if(thread.getPosts()[0].post_content.plain != testPostContent){
            log("Created post does not have the correct plain post content");
        }

        // Try getting the post individually
        var post = thread.getPost(newPostId);
        if(post == false){
            log("Post unable to be gotten using thread.getPost()");
        }
        if(post.post_id != newPostId){
            log("Wrong post gotten by post.getPost()");
        }

        // Create a second post and delete the first one
        thread.createPost(testPostContent);
        thread.remove(newPostId);

        if(thread.count() != 1){
            log("Thread Posts count is incorrect after creating and delete a post");
        }

        // Create several posts and delete them all
        thread.createPost(testPostContent);
        thread.createPost(testPostContent);
        thread.createPost(testPostContent);
        thread.createPost(testPostContent);
        thread.createPost(testPostContent);

        thread.deleteAll();
        if(thread.count() != 0){
            log("Thread Posts count is incorrect after creating 5 posts and using thread.deleteAll()");
        }

        // Thread Tests Complete
        log("Thread Tests Complete.")
    }

    threads();

});