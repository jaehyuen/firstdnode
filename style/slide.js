$(document).ready(function(){
       // menu 클래스 바로 하위에 있는 a 태그를 클릭했을때
       $(".container_header_h1_a_12").click(function(){
           var submenu = $('.hide');

           // submenu 가 화면상에 보일때는 위로 보드랍게 접고 아니면 아래로 보드랍게 펼치기
           if( submenu.is(":visible") ){
               submenu.slideUp();
               $('.slide').css('border','2px solid white');
               $('.slide').css('box-shadow','0px 0px 0px');
           }else{
               submenu.slideDown();
               $('.slide').css('border','2px solid #61656E');
           }
       });
   });
   $(document).ready(function(){
          // menu 클래스 바로 하위에 있는 a 태그를 클릭했을때
          $(".container_header_h1_a_12_chat").click(function(){
              var submenu = $('.slide_div');


              // submenu 가 화면상에 보일때는 위로 보드랍게 접고 아니면 아래로 보드랍게 펼치기
              if( submenu.is(":visible") ){
                  submenu.slideUp();


              }else{
                  submenu.slideDown();

              }
          });
      });

      $(document).ready(function(){
             // menu 클래스 바로 하위에 있는 a 태그를 클릭했을때
             $(".container_header_h1_a_12_can").click(function(){
                 var submenu = $('.slide_div');


                 // submenu 가 화면상에 보일때는 위로 보드랍게 접고 아니면 아래로 보드랍게 펼치기
                 if( submenu.is(":visible") ){
                     submenu.slideUp();


                 }else{
                     submenu.slideDown();

                 }
             });
         });
