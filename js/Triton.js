window.Triton = {
    "version" : "0.5",
    "author" : "Tyler Carter",
    "repository" : "http://github.com/chacha/Triton",
    "contributors" : [
        "Tyler Carter",
        "Lucas Jones"
    ],
    "updated" : '<?php echo date("n.j.Y"); ?>',
    "copyright" : "2010",
    "debug" : true
};

// If PHP has not parsed the file, make the updated date the current date
if(window.Triton.updated.indexOf("<") == 0){
    d = new Date();
    window.Triton.updated = (d.getMonth() + 1) + "." + d.getDate() + "." + d.getFullYear();
}