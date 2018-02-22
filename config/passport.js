var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var User = require('../models/user');

// serializer deserializer
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// Middleware
passport.use('local-login', new localStrategy({
    usernameField: 'email',
    userpasswordField: 'password',
    passReqToCallback: true
},function(req,email,password,done){
	 User.findOne({email: email},function(err,user){
         if(err) return done(err);

         if(!user){
         	return done(null,req.flash('loginMessage',"Email id is not exists."));
         }

         if(!user.comparePassword(password)){
         	return done(null,req.flash('loginMessage',"Password is incorrect."));
         }
         done(null, user);
	 });
}));

// isAuthenticated

exports.isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}