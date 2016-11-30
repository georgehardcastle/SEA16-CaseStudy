var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');


var Order = require('../models/order');
var Cart = require('../models/cart');
var Customer = require('../models/user');
var Product = require('../models/product');

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

router.post('/customer-search', function(req, res, next){

 var val = req.body.input;

 if (val != "") {
   var successMsg = req.flash('success')[0];
   Customer.find({$text:{$search: val}}, function(err, docs) {
     if(docs != null) {
       var customers = [];
       for (var i = 0; i < docs.length; i++) {
         customers.push(docs[i]);
       }
       res.send({customers: customers});
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
     res.send({customers: customers});
   })
 }
});

router.post('/catalog-search', function(req, res, next){

 var val = req.body.input;

 if (val != "") {
   var successMsg = req.flash('success')[0];
   Product.find({$text:{$search: val}}, function(err, docs) {
     if(docs != null) {
       var products = [];
       for (var i = 0; i < docs.length; i++) {
         products.push(docs[i]);
       }
       res.send({products: products});
     } else {
       console.log("didn't find anything");
     }
     if (err) {
       console.log(err);
     }
   });
 } else {
   Product.find(function(err, docs) {
     var products = [];
     for (var i = 0; i < docs.length; i++) {
       products.push(docs[i]);
     }
     res.send({products: products});
   })
 }
});

router.post('/place-order', function(req, res, next) {
  var viewCart = JSON.parse(req.body.viewCart);

  console.log(viewCart);

  if (viewCart.length == 0) {
    res.send("no items selected");
  } else {
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    var products = [];

    for ( item in viewCart ) {

      var productId = viewCart[item].id;
      var productQty = viewCart[item].qty;

     console.log("id: " + productId + " qty: " + productQty );

     Product.findOne({ '_id': productId },function(err,product) {
       products.push(product);
       console.log(products);
     });
    //  console.log(counter);
   }
 }
});
    //    if (product) {
    //      for(var i=0; i<productQty; i++) {
    //        console.log("item: " + productId);
     //  cart.add(product, product.id);
    //      }
    //    }
     //
     //
     //
   // res.send("added to cart");
     //
    //  })



  // var stripe = require("stripe")("sk_test_9ilKltRSNlbS3WEMUBb0Tmxy");
  // var token = req.body.stripeToken;
  //
  // var charge = stripe.charges.create({
  //   amount: cart.totalPrice * 100, // Amount in pence
  //   currency: "gbp",
  //   source: token,
  //   description: "Example charge"
  // }, function(err, charge) {
  //   if (err) {
  //     req.flash('error', err.message);
  //     return res.redirect('/checkout');
  //   }
  //   var order = new Order({
  //     user: req.user,
  //     cart: cart,
  //     address: req.body.address,
  //     name: req.body.name,
  //     paymentId: charge.id,
  //     status: "Order placed"
  //   });
  //
  //   for ( var productID in cart.items ) {
  //     var itemQty = cart.items[productID].qty;
  //     var product = cart.items[productID].item;
  //
  //     var newStockLevel = product.stockLevel - itemQty;
  //
  //     Product.update({ _id: product._id }, { $set: { stockLevel: newStockLevel }}, function (err, raw) {
  //       //if (err) return handleError(err);
  //     });
  //
  //   }
  //   order.save(function(err, result) {
  //     req.flash('success', 'Successfully bought product!');
  //     req.session.cart = null;
  //     res.redirect('/');
  //   });
  // });

router.post('/customer-update', function(req, res, next){
  Customer.findOne({ 'email': req.body.email }, function (err, customer) {
    if (err) return console.log('error finding customer');
    res.send({customer: customer});
    });
});

router.post('/update-details-dash', function(req, res, next) {
  var searchEmail = req.body.email;

  var query = {email: searchEmail};
  var update = {email: req.body.email,
                firstname: req.body.firstName,
                lastname: req.body.lastName,
                firstlineofaddress: req.body.firstlineofaddress,
                town: req.body.town,
                postcode: req.body.postcode,
                contactnumber: req.body.contactnumber};
  var options = {new: true};
  Customer.findOneAndUpdate(query, update, options, function(err, person) {
    if (err) {
      console.log('got an error');
    }
    else res.send('Successfully Updated')
  });
});

router.post('/delete-customer', function(req, res, next) {
  Customer.remove({ email: req.body.email }, function(err) {
    if (!err) {
      res.send('Customer Removed')
    }
    else {
      console.log('Error!');
    }
  });
});

router.post('/register-customer', function(req, res, next) {
  var defaultPassword = "0000";
  var validEmail = req.body.email;

  function isValidEmailAddress(emailAddress) {
    var pattern = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return pattern.test(emailAddress);
  };

  if(isValidEmailAddress(validEmail)) {
    var newCustomer = new Customer({
      email: req.body.email,
//      password: encryptPassword(defaultPassword),
      password: defaultPassword,
      firstname: req.body.firstName,
      lastname: req.body.lastName,
      firstlineofaddress: req.body.firstlineofaddress,
      town: req.body.town,
      postcode: req.body.postcode,
      contactnumber: req.body.contactnumber
    });
    newCustomer.save(function(err, result) {
      if (err) {
        res.send('Error');
      }
      else {
        res.send('Account Successfully Created');
      }
    });
  }
  else {
    res.send('Error - please enter a valid email address');
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
