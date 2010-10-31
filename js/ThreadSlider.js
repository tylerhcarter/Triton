var TritonSlider = (function(editor){

   var obj = {};

   obj.init = function(){
       //obj.start();
   }

   obj.start = function(){
       editor.draw(false, function(){
           $("section").click(function(){
              var copy = $(this).clone();
              
              $(this).css({"position":"relative"});
              $(this).animate({
                left : "-80%"
              }, 300, function() {
                
                $(this).replaceWith(copy).hide();
                $(copy).css({
                  right : "-1000%",
                  position: "relative"
              })
                $(copy).animate({
                    right : "0px"
                }, 300)

              });
           });
       });
   }

   obj.draw = function(){
   }

   return obj;

});