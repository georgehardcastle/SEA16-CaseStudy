var passport = require('passport');
var Employee = require('../models/employee');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  Employee.findById(id, function(err, user) {
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

  var errors = req.validationErrors();
  if (errors) {
    var messages = [];
    errors.forEach(function(error) {
      messages.push(error.msg);
    });
    return done(null, false, req.flash('error', messages));
  }

  Employee.findOne({'email': email}, function(err, user) {
    if (err) {
      return done(err);
    }
    if (user) {
      return done(null, false, {message: 'Email is already in use'});
    }
    var newEmployee = new Employee();
    newEmployee.email = email;
    newEmployee.password = newEmployee.encryptPassword(password);
    newEmployee.firstname = req.body.firstname;
    newEmployee.lastname = req.body.lastname;

    newEmployee.save(function(err, result) {
      if (err) {
        return done(err);
      }
      return done(null, newEmployee);
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
  Employee.findOne({'email': email}, function(err, user) {
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
