var express=require('express');
var bodyParser = require('body-parser');
var session=require('express-session');
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
app.use(session({
  secret:'123qwe123qwe123qwe',
  resave: false,
  saveUninitialized: true
}));
//app.use(bodyParser.urlencoded({extended: false}));
router.post('/:id/edit',(req,res)=>{

  var title=req.body.title;
  var description=req.body.description;
  var author=req.body.author;
  var id=req.params.id;
    var sql="UPDATE topic SET title=?, description=? WHERE id=?";
    conn.query(sql,[title, description, id],(err,results,fields)=>{
      if(err){
        console.log(err);
      }
      else {
        res.redirect('/main/'+id);
      }

    });
});

router.post('/:id/delete',(req,res)=>{
  var id=req.params.id;
  var sql="DELETE FROM topic WHERE id=?";
  conn.query(sql,[id],(err,results)=>{
    res.redirect('/main');
  });
});

router.post('/new',(req,res)=>{


  var title=req.body.title;
  var description=req.body.description;
  var author=req.session.displayname;
  var sql="INSERT INTO topic (title, description, author) VALUES(?,?,?)";
  conn.query(sql,[title, description, author],(err,results1,fields)=>{
    if(err){
        console.log(err);
    }
    else {
      res.redirect('/main/');
    }
  });
});

router.get('/:id/edit',(req,res)=>{
  if(req.session.displayname){
    var displayname=req.session.displayname;
  }
  else {
    var displayname='login';
  }

  var sql="SELECT id,title FROM topic";
  conn.query(sql,(err,results,fields)=>{
    var id=req.params.id;
  if(id){
    var sql="SELECT * FROM topic WHERE id=?";
      conn.query(sql,[id],(err,results2,fields)=>{
        if(err){
            console.log(err);
        }
        else {
          if(req.session.displayname==results2[0].author){
            res.render('edit',{topic:results, top:results2[0],displayname:displayname});
          }
          else {
              res.send('<script>alert("자신만 가능");location.href="/main" ;</script>')
          }
        }
      });
    }
  else {

    }
  });
});

router.get('/:id/delete',(req,res)=>{
  var id=req.params.id;
  if(req.session.displayname){
    var displayname=req.session.displayname;
  }
  else {
    var displayname='login';

  }
  var sql="SELECT id,title FROM topic";

  conn.query(sql,(err,results,fields)=>{
    var sql="SELECT * FROM topic WHERE id=?";
    conn.query(sql,[id],(err,results2,fields)=>{
      if (err) {
        console.log(err);
      }
      else {
        if (results2.length===0) {
          console.log(err);
        }
        else {
          if(req.session.displayname==results2[0].author){
            res.render('delete',{topic:results, top:results2[0],displayname:displayname});
          }
          else {
              res.send('<script>alert("자신만 가능");location.href="/main" ;</script>')
          }



        }
      }
    });


  });
  });

router.get('/new',(req,res)=>{
  if(req.session.displayname){
    var displayname=req.session.displayname;
  }
  else {
    var displayname='login';
    res.redirect('/user/err');
  }
  var sql="SELECT id,title FROM topic";
  conn.query(sql,(err,results,fields)=>{

  res.render('new',{topic:results,displayname:displayname});
  });
});

module.exports=router;
