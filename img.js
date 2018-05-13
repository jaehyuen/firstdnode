var express=require('express');
var session=require('express-session');
var bodyParser = require('body-parser');
var multer  = require('multer');
require('date-utils');
var app=express();
var fs=require('fs');
var router=express.Router();
var mysql      = require('mysql');
var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'o2'
});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'img')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});
var upload = multer({ storage: storage });
//app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
  secret:'123qwe123qwe123qwe',
  resave: false,
  saveUninitialized: true
}));

router.post('/upload',upload.single('userfile'),(req,res)=>{
  var title=req.body.title;
  var filename=req.file.originalname;
  var nickname=req.session.displayname;
  var nowtime=new Date();
  var sql="INSERT INTO img (title, img_name, nowtime, author) VALUES(?,?,?,?)";
  conn.query(sql,[title,filename,nowtime,nickname],(err,results1,fields)=>{
    if(err){
      console.log(err);
    }
    else{

    res.redirect('/image');
  }
  })


})

router.get('/:id/del',(req,res)=>{
 var id =req.params.id;
 var sql='delete from img where id=?';
 conn.query(sql,[id],(err,results1,fields)=>{
   if(err){
     console.log(err);
   }
   else{
     res.redirect('/image');
   }
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
  var sql='SELECT id,title FROM img';
  conn.query(sql,(err,results1,fields)=>{

      if(results1[0]!=null){
        res.render('img_new',{displayname:displayname, topic:results1});
      }
      else{
        res.render('img_new',{displayname:displayname});
      }

  });

});
module.exports=router;
