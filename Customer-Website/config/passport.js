var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use('local.signup', new LocalStrategy({

  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true

}, function(req, email, password, done){

  req.checkBody('email', 'Invalid email').notEmpty().isEmail();
  req.checkBody('password', 'Invalid password').notEmpty().isLength({min:4});
  req.checkBody('firstname', 'Invalid firstname').notEmpty().isLength({min:2});
  req.checkBody('lastname', 'Invalid lastname').notEmpty().isLength({min:2});
  req.checkBody('firstlineofaddress', 'Invalid first line of address').notEmpty().isLength({min:4});
  req.checkBody('town', 'Invalid town').notEmpty().isLength({min:2});
  req.checkBody('postcode', 'Invalid postcode').notEmpty().isLength({min:4});
  req.checkBody('contactnumber', 'Invalid contact number').notEmpty().isLength({min:4});


  var errors = req.validationErrors();
  if (errors) {
    var messages = [];
    errors.forEach(function(error) {
      messages.push(error.msg);
    });
    return done(null, false, req.flash('error', messages));
  }
  User.findOne({'email': email}, function(err, user) {
    if (err) {
      return done(err);
    }
    if (user) {
      return done(null, false, {message: 'Email is already in use'});
    }
    var newUser = new User();
    newUser.email = email;
    newUser.password = newUser.encryptPassword(password);
    newUser.firstname = req.body.firstname;
    newUser.lastname = req.body.lastname;
    newUser.firstlineofaddress = req.body.firstlineofaddress;
    newUser.town = req.body.town;
    newUser.postcode = req.body.postcode;
    newUser.contactnumber = req.body.contactnumber;
    newUser.accounttype = req.body.accounttype
    newUser.companyname = req.body.companyname;

    newUser.save(function(err, result) {
      if (err) {
        return done(err);
      }
      return done(null, newUser);
    });
  });
}));

passport.use('local.signin', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function(req, email, password, done) {
  req.checkBody('email', 'Invalid email').notEmpty().isEmail();
  req.checkBody('password', 'Invalid password').notEmpty();
  var errors = req.validationErrors();
  if (errors) {
    var messages = [];
    errors.forEach(function(error) {
      messages.push(error.msg);
    });
    return done(null, false, req.flash('error', messages));
  }
  User.findOne({'email': email}, function(err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, {message: 'No user found'});
    }
    if (!user.validPassword(password)) {
      return done(null, false, {message: 'Wrong password'});
    }
    return done(null, user);
  });
}));
