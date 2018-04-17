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

router.get('/',(req,res)=>{
  var nickname=req.session.displayname;
  var sql='SELECT * FROM topic WHERE author=?';
  conn.query(sql,[nickname],(err,results,fields)=>{
    if(err){
      console.log(err);
    }
    else {
      var sql='SELECT * FROM topic_text WHERE user_name=?';
      conn.query(sql,[nickname],(err,results2,fields)=>{
        if(err){
          console.log(err);
        }
        else {
          var sql='SELECT * FROM sym WHERE user_nickname=? and user_sym=?';
          conn.query(sql,[nickname,1],(err,results3,fields)=>{
            if(err){
              console.log(err);
            }
            else {
              res.render('mypg',{topic:results, text:results2, sym:results3, displayname:nickname});
            }
          });
        }
      });
    }
  });

});
router.get('/err',(req,res)=>{
  res.send('<script>alert("없습니다.");location.href="/mypg" ;</script>')
})
router.get('/topic',(req,res)=>{
  var nickname=req.session.displayname;
  var sql="SELECT * FROM topic WHERE author=?";
  conn.query(sql,[nickname],(err,results,fields)=>{
    if (err){
      console.log(err);
    }
    else{
      res.render('mypg_topic',{topic:results});
    }
  });
});

router.get('/text',(req,res)=>{
  var nickname=req.session.displayname;
  var sql="SELECT * FROM topic_text WHERE user_name=?";
  conn.query(sql,[nickname],(err,results,fields)=>{
    if (err){
      console.log(err);
    }
    else{
      res.render('mypg_topic',{text:results});
    }
  });
});

router.get('/sym',(req,res)=>{
  var nickname=req.session.displayname;
  var sql="SELECT * FROM topic_text";
  conn.query(sql,(err,results,fields)=>{
    if (err){
      console.log(err);
    }
    else{
      var sql='SELECT * FROM sym WHERE user_nickname=? and user_sym=?';
      conn.query(sql,[nickname,1],(err,results2,fields)=>{
        if(err){
          console.log(err);
        }
        else {
          res.render('mypg_topic',{symtext:results, sym:results2});
        }
      })

    }
  });
});
module.exports=router;
