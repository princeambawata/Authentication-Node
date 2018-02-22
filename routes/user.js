var router = require('express').Router();
var passport = require('passport');
var passportLocal = require('../config/passport')
var User = require('../models/user');


router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

router.get('/profile',function(req,res){
   if(!req.user) return res.redirect('/signin');
   res.render('accounts/profile',{user: req.user});
});

router.get('/signin',function(req,res){
	if(!req.user){
         res.render('accounts/signin',{loginMessage: req.flash('loginMessage')})
    }else{
    	res.redirect('/');
    }
});

router.post('/signin',passport.authenticate('local-login',{
   successRedirect: '/profile',
   failureRedirect: '/signin',
   failureFlash: true
}));

router.get('/edit-profile', function(req,res){
   if(!req.user) return res.redirect('/signin')
   res.render('accounts/edit-profile',{message: req.flash('message')});
});

router.post('/edit-profile',function(req,res,next){
  if(!req.user) return res.json("Signin first.");
  User.findOne({_id: req.user._id},function(err,user){
      if(err) return next(err);
      if(req.body.name) user.profile.name = req.body.name;
      if(req.body.address) user.address = req.body.address;
      user.save(function(err){
          if(err) return next(err);
          req.flash('message', "Successfully Updated your profile.");
          return res.redirect('/edit-profile');
      });
  });
});

router.get('/signup', function(req,res){
    res.render('accounts/signup',{errors: req.flash('errors')});
});

router.post('/signup',function(req,res,next){
   var user = new User();
   user.profile.name = req.body.name;
   user.email = req.body.email;
   user.password = req.body.password;
   user.profile.picture = user.gravatar();
   User.findOne({email: req.body.email},function(err,existingUser){
        if(err) return next(err);

        if(existingUser){
        	req.flash('errors', existingUser.email + " already exist.")
        	res.redirect('/signup');
        }else{
        	user.save(function(err){
                if(err) return next(err);
                
                req.logIn(user,function(err){       //this logIn function adding 
                	                                //cookie to brower given by passport library
                    if(err) next(err);
                    res.redirect('/profile');
                });
        	});
        }
   });
});

module.exports = router;