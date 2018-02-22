var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var BodyParser = require('body-parser');
var ejs = require('ejs');
var ejs_mate = require('ejs-mate');
var session = require('express-session');
var flash = require('express-flash');
var CookieParser = require('cookie-parser');
var passport = require('passport');
var MongoStore = require('connect-mongo')(session);

var secret = require('./config/secret');
var app = express();

mongoose.connect(secret.database,function(err){
    if(err) console.log(err);
    console.log('database is Connected');
});

//MiddleWare
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({extended: true}));
app.engine('ejs',ejs_mate);
app.set('view engine', 'ejs');
app.use(flash());
app.use(CookieParser());
app.use(session({
   resave: true,
   saveUninitialized: true,
   secret: secret.secretKey,
   store: new MongoStore({ url: secret.database, autoReconnect: true})
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req,res,next){
   res.locals.user = req.user;
   next();
});


var userRoutes = require('./routes/user');
var homeRoutes = require('./routes/home');
app.use(homeRoutes);
app.use(userRoutes);
//

app.listen(3000,function(err){
   if(err){
   	console.log(err);
   }else{
   	console.log("server is running");
   }
});