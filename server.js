#!/usr/bin/env node
//before run do mongorestore dump

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
//const middleware = require('./middleware')
//var config = require('./config');
//var middleware = require('./')


// create express app
const app = express();
const cors = require('cors');
//var Db = require('mongodb').Db;
//var MongoClient = require('mongodb').MongoClient;
var Server = require('mongodb').Server;
const bearerToken = require('express-bearer-token');

// parse requests of content-type - application/x-www-form-urlencoded
/*app.use(bodyParser.urlencoded({
    extended: false
}))
*/
// parse requests of content-type - application/json
app.use(bodyParser.json())

app.use(cors());





app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/views'));
app.use('/public', express.static(__dirname + '/public'));
// app.use('/public', express.static(__dirname + '/public'));
//app.use('/favicon.ico', express.static(__dirname + '/favicon.ico'));
//const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
let User = require('./models/user.model');
let geomodel = require('./models/geojson');
let lines = require('./models/lines');
let district = require('./models/district');
let entity = require('./models/entity');
let grid = require('./models/grid');



mongoose.connect('mongodb://localhost/demo',()=>{
console.log('Database connected for demo');
});
var db = mongoose.connection;
db.once('open',function(){
   console.log('connect to mongodb');
})
db.on('error',function(err){
   console.log(err +'err in create db');
})

app.post('/signup', function(req, res) {
   console.log(req.body);
   bcrypt.hash(req.body.password, 10, function(err, hash){
      if(err) {
         return res.status(500).json({
            error: err
         });
      }
      else {
         const user = new User({
            _id: new  mongoose.Types.ObjectId(),
            email: req.body.email,
            password: hash    
         });
         user.save().then(function(result) {
            console.log(result);
            res.status(200).json({
               success: 'New user has been created'
            });
         }).catch(error => {
            res.status(500).json({
               error: err
            });
         });
      }
   });
});


/*app.post('/signin', function(req, res){
   User.findOne({email: req.body.email})
   .exec()
   .then(function(user) {
      bcrypt.compare(req.body.password, user.password, function(err, result){
         if(err) {
            return res.status(401).json({
               failed: 'Unauthorized Access'
            });
         }
         if(result) {
            var JWTToken = jwt.sign({
               email: user.email,
               _id: user._id
            },
            'secret',
              
               );
            return res.status(200).json({
               success: 'Authurization success',
               token: JWTToken
            });
         }
         return res.status(401).json({
            failed: 'Unauthorized Access'
         });
      });
   })
   .catch(error => {
      res.status(500).json({
         error: error
      });
   });
});*/

app.post('/signin', function(req, res){
      User.findOne({email: req.body.email})
      .exec()
      .then(function(user) {
         bcrypt.compare(req.body.password, user.password, function(err, result){
            if(err) {
               return res.status(401).json({
                  failed: 'Unauthorized Access'
               });
            }
            if(result) {
               var JWTToken = jwt.sign({
                  email: user.email,
                  _id: user._id
               },
               'secret',
                 
                  );
               return res.status(200).json({
                  success: 'Authurization success',
                  token: JWTToken
               });
            }
            return res.status(401).json({
               failed: 'Unauthorized Access'
            });
         });
      })
      .catch(error => {
         res.status(500).json({
            error: error
         });
      });
   });
   





app.get('/', (req, res) => {
    res.render('index', {
        title: 'AdminPanel'
    })
});

//const mongo = require('mongodb').MongoClient;
//var url = process.env.MONGO_URL;
//var url = 'mongodb://localhost:27017/';
//console.log(url);

app.post('/acshapes/',verifyToken, (req, res) => {
   jwt.verify(req.token,'secret',(err,authData)=>{
      if(err){
         res.sendStatus("403");
      }
      else{
         geomodel.find({},function(err,result) {
            if (err) throw err;
            //console.log(result)
            res.json(result);
            
       });
   }
});
});
//}
app.post('/entity/',verifyToken, (req, res) => {
   jwt.verify(req.token,'secret',(err,authData)=>{
      if(err){
         res.sendStatus("403");
      }
      else{
         entity.find({},function(err,result) {
            if (err) throw err;
            //console.log(result)
            res.json(result);
            
       });
         }



    });
});
/*const checkToken = (req, res) => {
   const header = req.headers['authorization'];

   if(typeof header !== 'undefined') {
       const bearer = header.split(' ');
       const token = bearer[1];*/

             
   
//if(accessed_token==JWTToken){

app.post('/connect',verifyToken, (req, res) => {
   jwt.verify(req.token,'secret',(err,authData)=>{
      if(err){
         res.sendStatus("403");
      }
      else{

            entity.find({},function(err,result) {
                  if (err) throw err;
                  //console.log(result)
                  res.json(result);
                  
             });
       
      }
      });

});


    

//else{
 //console.log('unauthorized access')
//}


app.post('/grid/',verifyToken, (req, res) => {

      jwt.verify(req.token,'secret',(err,authData)=>{
      if(err){
         res.sendStatus("403");
      }
      else{
         grid.find({},function(err,result) {
            if (err) throw err;
            //console.log(result)
            res.json(result);
            
       });
         }
      });
});

app.post('/lines',verifyToken, (req, res) => {
   jwt.verify(req.token,'secret',(err,authData)=>{
      if(err){
         res.sendStatus("403");
      }
      else{
   //  mongo.connect(url, function(err, db) {
   //      if (err) throw err;
   //      var db_api = db.db("demo");
        //console.log(req.query)




                  lines.find({},function(err,result) {
                     if(err){
                        console.log(err);

                     }
                     else {
                        res.json(result);
                  
              
                     }
                  })
                  //if (err) throw err;
                  //console.log(result)
                  



    //});
   }
});
});
app.post('/district',verifyToken, (req, res) => {
   jwt.verify(req.token,'secret',(err,authData)=>{
      if(err){
         res.sendStatus("403");
      }
      else{
         district.find({},function(err,result) {
            if(err){
               console.log(err);

            }
            else {
               res.json(result);
         
     
            }
         })
   }
});
});
//}
function verifyToken(req,res,next){
   const bearerHeader = req.headers['authorization'];
   if(typeof bearerHeader!=='undefined'){
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];
      req.token = bearerToken;
      next();

   }else{
      res.sendStatus(403);
   }
}


app.listen(3001,'0.0.0.0');
//console.log('server is running on '+port);

// listen for requests
