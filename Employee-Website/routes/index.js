var express = require('express');
var router = express.Router();
var csrf = require('csurf');

var Customer = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
      res.render('employee/index', {title: 'Employee - Sky Experiences'});
});

router.get('/dashboard', isLoggedIn, function(req, res, next) {
  Customer.find(function(err, docs) {
    var customers = [];
    for (var i = 0; i < docs.length; i++) {
      customers.push(docs[i]);
    }
    res.render('employee/dashboard', {title: 'Employee - Sky Experiences', customers: customers});
  })
});

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/user/signin');
}
