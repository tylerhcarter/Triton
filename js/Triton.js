window.Triton = {
    "version" : "0.6",
    "author" : "Tyler Carter",
    "repository" : "http://github.com/chacha/Triton",
    "contributors" : [
        "Tyler Carter",
        "Lucas Jones"
    ],
    "updated" : '<?php echo date("n.j.Y"); ?>',
    "updated_time" : '<?php echo date("G:i:s"); ?>',
    "copyright" : "2010",
    "debug" : true
};

// If PHP has not parsed the file, make the updated date the current date
if(window.Triton.updated.indexOf("<") == 0){
    d = new Date();
    window.Triton.updated = (d.getMonth() + 1) + "." + d.getDate() + "." + d.getFullYear();
    window.Triton.updated_time = d.getUTCHours() + ":" + d.getUTCMinutes() + ":" + d.getSeconds();
}