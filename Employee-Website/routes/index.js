var express = require('express');
var router = express.Router();
var csrf = require('csurf');

var Order = require('../models/order');
var Cart = require('../models/cart');
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

router.post('/customer-order', function(req, res, next){

  Customer.findOne({ 'email': req.body.email }, function (err, customer) {

    if (err) return console.log('error finding customer');

    Order.find({user: customer}, function(err, orders) {
      if (err) {
        return console.log('error finding order');
      }
      var cart;
      orders.forEach(function(order) {
        cart = new Cart(order.cart);
        order.items = cart.generateArray();
      });
      res.send({orders: orders});
    });
  });
});

router.post('/search', function(req, res, next){

 var val = req.body.search;

 if (val != "") {
   searchCriteria = true;
   var successMsg = req.flash('success')[0];
   Customer.find({$text:{$search: val}}, function(err, docs) {
     if(docs != null) {
       var customers = [];
       for (var i = 0; i < docs.length; i++) {
         customers.push(docs[i]);
       }
       res.render('employee/dashboard', {title: 'Employee - Sky Experiences', customers: customers});
     } else {
       console.log("didn't find anything");
     }
     if (err) {
       console.log(err);
     }
   });
 } else {
   Customer.find(function(err, docs) {
     var customers = [];
     for (var i = 0; i < docs.length; i++) {
       customers.push(docs[i]);
     }
     res.render('employee/dashboard', {title: 'Employee - Sky Experiences', customers: customers});
   })
 }
});

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/user/signin');
}
