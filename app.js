var express=require('express');
var app=express();
var fs=require('fs');
var bodyParser = require('body-parser');
var multer  = require('multer');
var session=require('express-session');
var post=require('./post.js');
var user=require('./user.js');
var comment=require('./comment.js');
var mypg=require('./mypg.js');
var img=require('./img');
var http=require('http').Server(app);
var io=require('socket.io')(http);
require('date-utils');
var newDate=new Date();
var time=newDate.toFormat('YYYY-MM-DD HH24:MI:SS');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'data')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});
app.use(session({
  secret:'123qwe123qwe123qwe',
  resave: false,
  saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use('/post',post);
app.use('/user',user);
app.use('/comment',comment);
app.use('/mypg',mypg);
app.use('/img',img);
app.use(express.static('style'));


app.set('view engine','jade');
app.set('views','./views');
app.locals.pretty = true;

var mysql      = require('mysql');
var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'o2'
});
var upload = multer({ storage: storage });
app.use('/static',express.static('img'));


app.get('/',(req,res)=>{
  if(req.session.displayname){
    var displayname=req.session.displayname;
  }
  else {
    var displayname='login';
  }
  res.render('blog',{displayname:displayname});
});

app.get(['/image','/image/:id'],(req,res)=>{
  if(req.session.displayname){
    var displayname=req.session.displayname;
  }
  else {
    var displayname='login';
  }
  var id=req.params.id;
  var sql='SELECT id,title,img_name FROM img';
  conn.query(sql,(err,results1,fields)=>{
    if(id){
      var sql='SELECT * FROM img WHERE id=?';
      conn.query(sql,[id],(err,results2,fields)=>{
        if(err){
          console.log(err);
        }
        else{
          res.render('image',{displayname:displayname, topic:results1,top:results2[0]});
        }
      });
    } else{
      if(results1[0]!=null){
        res.render('image',{displayname:displayname, topic:results1});
      }
      else{
        res.render('image',{displayname:displayname});
      }
    }
  });

});

app.get(['/main','/main/:id'],(req,res)=>{

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
          var sql="SELECT * FROM topic_text WHERE title_id=?";
            conn.query(sql,[id],(err,results3,fields)=>{
              if(err){
                console.log(err);
              }
              else {
                var sql="SELECT * FROM sym WHERE user_nickname=?";
                conn.query(sql,[displayname],(err,results4,fields)=>{
                  if(err){

                  }
                else {
                  if(results4[0]==null){
                    res.render('main',{topic:results,top:results2[0], text:results3, displayname:displayname});
                  }else{
                    console.log(results2[0]);
                res.render('main',{topic:results,top:results2[0], text:results3, displayname:displayname,sym:results4});
              }}
              });
              }
            });

        }
      });
    }
  else {

      res.render('main',{topic:results, displayname:displayname});
    }
  });


});

var usercount=1;
io.on('connection',(socket)=>{

  var name='user'+usercount++;
  io.to(socket.id).emit('change name',name);

  socket.on('disconnect',()=>{
    usercount--;
  });

  socket.on('send message',(name,text)=>{

    var msg=name+' : '+text;

    io.emit('message',msg);
  });
});

http.listen(3004,()=>{
  console.log('connected 3004 port');
});
