var express=require('express');
var session=require('express-session');
var bodyParser = require('body-parser');
require('date-utils');
var app=express();
var router=express.Router();
var mysql      = require('mysql');
var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'o2'
});
//app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
  secret:'123qwe123qwe123qwe',
  resave: false,
  saveUninitialized: true
}));

router.post('/:id/ed',(req,res)=>{


      var description=req.body.description;
      var id=req.params.id;
      var title_id=req.body.title_id;
      var newDate=new Date();
      var time=newDate.toFormat('YYYY-MM-DD HH24:MI:SS');
        var sql="UPDATE topic_text SET description_texts=? ,nowtime=? WHERE id=?";
        conn.query(sql,[description,time,id],(err,results,fields)=>{
          if(err){
            console.log(err);
          }
          else {
            res.redirect('/main/'+title_id);
          }

        });

    });

router.post('/:id/del',(req,res)=>{

      var id=req.params.id;
      var title_id=req.body.title_id;
      var user_passwords=req.body.user_password;


      var sql="SELECT * FROM topic_text WHERE id=?";
      conn.query(sql,[id],(err,results)=>{
        var password=results[0].user_password;
        if(password==user_passwords){

          var sql="DELETE FROM topic_text WHERE id=?";
          conn.query(sql,[id],(err,results)=>{
            res.redirect('/main/'+title_id);
          });
        }
        else {
          res.send('<script>alert("비번틀림");location.href="/comment/' + id + '/del";</script>')


        }
      });

    });

router.post('/new',(req,res)=>{
      var nickname=req.session.displayname;
      // req.session.sym=0;
      var sql="SELECT * from userdata WHERE user_nickname=?";
      conn.query(sql,[nickname],(err,result1,fields)=>{

        var user_password=result1[0].user_password;
        var description=req.body.description;
        var id=req.body.id;
        var newDate=new Date();
        var time=newDate.toFormat('YYYY-MM-DD HH24:MI:SS');
        var sql="INSERT INTO topic_text (title_id, user_name, user_password, description_texts, nowtime, sym_count) VALUES(?,?,?,?,?,0)";
        conn.query(sql,[id,nickname,user_password,description,time],(err,results,fields)=>{
          if(err){
            console.log(err);
          }
          else{
            res.redirect('/main/'+id);
          }
        });

      });
    });

router.get('/:title_id/:id/del',(req,res)=>{
  if(req.session.displayname){
    var displayname=req.session.displayname;
    // var sym=1;
  }
  else {
    var displayname='login';
    // var sym=0;
  }
  var sql="SELECT id,title FROM topic";
  var title_id=req.params.title_id;
  var id=req.params.id;
    var nickname=req.session.displayname;
  conn.query(sql,(err,results,fields)=>{
    var sql="SELECT * FROM topic_text WHERE id=?";
    conn.query(sql,[title_id],(err,results2,fields)=>{
      if (err) {
        console.log(err);
      }
      else {
        if (results2.length===0) {
          console.log(err);
        }
        else {

          if(results2[0].user_name==nickname){
          res.render('del',{topic:results, top:results2[0],displayname:displayname});
        }
          else {
              res.send('<script>alert("자신만가능");location.href="/main/' + id + '";</script>')

        }
        }
      }
    });


  });
  });

router.get('/:title_id/:id/ed',(req,res)=>{
  if(req.session.displayname){
    var displayname=req.session.displayname;
    // var sym=1;
  }
  else {
    var displayname='login';
    // var sym=0;
  }
  var id=req.params.id;
  var title_id=req.params.title_id;
  var nickname=req.session.displayname;

  var sql="SELECT id,title FROM topic";
  conn.query(sql,(err,results,fields)=>{

    var sql="SELECT * FROM topic WHERE id=?";
      conn.query(sql,[id],(err,results2,fields)=>{
        if(err){
            console.log(err);
        }
        else {
          var sql="SELECT * FROM topic_text WHERE title_id=?";
            conn.query(sql,[id],(err,results3,fields)=>{
              if(err){
                console.log(err);
              }
              else {


                var sql="SELECT * FROM topic_text WHERE id=?";
                conn.query(sql,[title_id],(err,results4,fields)=>{
                  if(err){
                    console.log(err);
                  }
                  else {

                    if(results4[0].user_name==nickname){

                    res.render('ed',{topic:results,top:results2[0], text:results3, title:results4[0], displayname:displayname});
                  }else {


                      res.send('<script>alert("자신만가능");location.href="/main/' + id + '";</script>')

                  }
                }
                });

              }
            });
        }
      });
    });

  });


router.get('/:title_id/:id/sym',(req,res)=>{
  if(req.session.displayname){
    var displayname=req.session.displayname;
    // var sym=1;
  }
  else {
    var displayname='login';
    // var sym=0;
  }
  var id=req.params.id;
  var title_id=req.params.title_id;
  var nickname=req.session.displayname;
  var sql="SELECT * from sym WHERE comment_id=? and user_nickname=?";
  conn.query(sql,[title_id,nickname],(err,results,fields)=>{
    if(err){
      console.log(err);
    }
    else {

      if(results[0]==null){

        var sql="INSERT INTO sym (comment_id, user_nickname, user_sym) VALUES(?,?,false)";
        conn.query(sql,[title_id,nickname],(err,results1,fields)=>{
          if(err){
            console.log(err);
          }else {


          res.redirect('/comment/'+title_id+'/'+id+'/sym');
        }
        });
      }
      else if(title_id==results[0].comment_id&&nickname==results[0].user_nickname&&results[0].user_sym==true){

        var sql="SELECT * from topic_text WHERE id=?";
        conn.query(sql,[title_id],(err,results1,fields)=>{
          if(err){
            console.log(err);
          }
          else {
            var sym_count=results1[0].sym_count-1;
            var sql="UPDATE topic_text SET sym_count=? WHERE id=?";
            conn.query(sql,[sym_count,title_id],(err,results2,fields)=>{
                if(err){
                  console.log(err);
                }
                else {
                  var sql="UPDATE sym SET user_sym=false WHERE comment_id=? and user_nickname=?";
                  conn.query(sql,[title_id,nickname],(err,results3,fields)=>{
                    if(err){
                      console.log(err);
                    }
                    else {
                      res.redirect('/main/'+id);
                    }
                  });
                }
              });
          }
        });
      }else if(title_id==results[0].comment_id&&nickname==results[0].user_nickname&&results[0].user_sym==false){

        var sql="SELECT * from topic_text WHERE id=?";
        conn.query(sql,[title_id],(err,results1,fields)=>{
          if(err){
            console.log(err);
          }
          else {
            var sym_count=results1[0].sym_count+1;
            var sql="UPDATE topic_text SET sym_count=? WHERE id=?";
            conn.query(sql,[sym_count,title_id],(err,results2,fields)=>{
                if(err){
                  console.log(err);
                }
                else {
                  var sql="UPDATE sym SET user_sym=true WHERE comment_id=? and user_nickname=?";
                  conn.query(sql,[title_id,nickname],(err,results3,fields)=>{
                    if(err){
                      console.log(err);
                    }
                    else {
                      res.redirect('/main/'+id);
                    }
                  });
                }
              });
          }
        });
      }else{
        res.redirect('/main');
      }


    }
  });
});

module.exports=router;
