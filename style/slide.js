$(document).ready(function(){
       // menu 클래스 바로 하위에 있는 a 태그를 클릭했을때
       $(".container_header_h1_a_12").click(function(){
           var submenu = $('.hide');

           // submenu 가 화면상에 보일때는 위로 보드랍게 접고 아니면 아래로 보드랍게 펼치기
           if( submenu.is(":visible") ){
               submenu.slideUp();
               $('.slide').css('border','0px');
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
                  $('.slide_div_div').css('border','0px');
                  $('.slide_div_div').css('box-shadow','0px 0px 0px');
                



              }else{
                  submenu.slideDown();
                    $('.slide_div_div').css('border','2px solid #61656E');
                    $('.slide_div_div').css('box-shadow',' 5px 5px 10px #aaaaaa');
                    

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
                     $('.slide_div_div').css('border','0px');
                     $('.slide_div_div').css('box-shadow','0px 0px 0px');


                 }else{
                     submenu.slideDown();
                      $('.slide_div_div').css('border','2px solid #61656E');
                 }
             });
         });
        function delete_con(id){

          if(confirm('삭제?')==true){
            location.href='/post/'+id+'/delete';
          }
          else {

          }
        }
        function delete_comment_con(id,title_id){

          if(confirm('삭제?')==true){
            location.href='/comment/'+id+'/'+title_id+'/del';
          }
          else {

          }
        }

        function delete_img_con(id,title_id){

          if(confirm('삭제?')==true){
            location.href='/img/'+id+'/del';
          }
          else {

          }
        }
        var upload = document.getElementsByTagName('input')[0],
            holder = document.getElementById('holder'),
            state = document.getElementById('status');

        if (typeof window.FileReader === 'undefined') {
          state.className = 'fail';
        } else {
          state.className = 'success';
          state.innerHTML = 'File API & FileReader available';
        }

        upload.onchange = function (e) {
          e.preventDefault();

          var file = upload.files[0],
              reader = new FileReader();
          reader.onload = function (event) {
            var img = new Image();
            img.src = event.target.result;
            // note: no onload required since we've got the dataurl...I think! :)
            if (img.width > 560) { // holder width
              img.width = 560;
            }
            holder.innerHTML = '';
            holder.appendChild(img);
          };
          reader.readAsDataURL(file);

          return false;
        };
