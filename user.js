var express=require('express');
var session=require('express-session');
var bodyParser = require('body-parser');
var app=express();
require('date-utils');
var newDate=new Date();
var time=newDate.toFormat('YYYY-MM-DD HH24:MI:SS');
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

router.post('/login',(req,res)=>{
console.log(req.body.user_id+", "+req.body.user_password);
  if(!req.body || !req.body.user_id || !req.body.user_password){
    res.send('<script>alert("아이디 또는 비밀번호 화인");location.href="/user/login";</script>');
  }
  else{

  var id=req.body.user_id;
  var password=req.body.user_password;


  var sql="SELECT * from userdata WHERE user_id=?";
  conn.query(sql,[id],(err,results,fields)=>{
    if(err){
       console.log(err);

    }
    else {

      if(results[0].user_id==id&&results[0].user_password==password){
        req.session.displayname=results[0].user_nickname;
        // req.session.sym=results[0].user_sym;
        res.redirect('/main');
      }else {
        res.send('<script>alert("비번틀림");location.href="/user/login";</script>');
    }
  }
  });
}
});

router.post('/join',(req,res)=>{
  var user_id=req.body.user_id;
  var user_password=req.body.user_password;
  var user_nickname=req.body.user_nickname;
  var sql="SELECT * FROM userdata WHERE user_id=?";
  conn.query(sql,[user_id],(err,results2,fields)=>{
    if(err){
      console.log(err);
    }
    else{
      if(!results2){
          res.send('<script>alert("아이디 중복");location.href="/user/join";</script>');
      }else{

        var sql="INSERT INTO userdata (user_id, user_password, user_nickname) VALUES(?,?,?)";

        conn.query(sql,[user_id, user_password, user_nickname],(err,results,fields)=>{
          if(err){
            console.log(err);
          }
          else {
            res.redirect('/main');
          }

  });
  }
  }
  });

});

router.get('/err',(req,res)=>{
  res.send('<script>alert("로그인을 하시오");location.href="/user/login";</script>');
});

router.get('/login',(req,res)=>{
  res.render('login');
});

router.get('/logout',(req,res)=>{
  delete req.session.displayname;
  res.redirect('/main');
});

router.get('/join',(req,res)=>{
  res.render('join');
});

module.exports=router;
