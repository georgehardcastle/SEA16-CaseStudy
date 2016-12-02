var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var accountSid = 'ACf6aaa9b72b1e9aff6fc5af65cd02cb33';
var authToken = '97745ae9477e3defa5a6374020c882ba';
var fromSmsNumber = '+441380800038';
var client = require('twilio')(accountSid, authToken);

var Cart = require('../models/cart');
var Product = require('../models/product');
var Order = require('../models/order');

var searchCriteria = false;

/* GET home page. */
router.get('/', function(req, res, next) {
  var successMsg = req.flash('success')[0];
  if (searchCriteria == false) {
    Product.find(function(err, docs) {
      var productChunks = [];
      var chunkSize = 3;
      for (var i = 0; i < docs.length; i += chunkSize) {
        productChunks.push(docs.slice(i, i + chunkSize));
      }
      res.render('shop/index', {title: 'Shopping Cart', products: productChunks, successMsg: successMsg, noMessage: !successMsg});
    })
  }
});

router.get('/add-to-cart/:id', function(req, res, next) {
  var productId = req.params.id;
  console.log(productId);
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function(err, product) {
    if (err) {
      // return res.redirect('/');
      return res.send("error");
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    res.send("success");
    // res.redirect('/');
  })
});

router.get('/reduce/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/remove/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/shopping-cart', function(req, res, next) {
  if (!req.session.cart) {
    return res.render('shop/shopping-cart', {products: null});
  }
  var cart = new Cart(req.session.cart);

  res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

router.get('/checkout', isLoggedIn, function(req, res, next) {
  if (!req.session.cart) {
    return res.redirect('shop/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];

  if(req.isAuthenticated()) {
    if (req.user.accounttype == "businesscustomer") {
      console.log(req.user.accounttype);
      res.render('shop/checkout-business', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg})
    }
    else {
      res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg})
    }
  }
});

router.post('/checkout', isLoggedIn, function(req, res, next) {
  if (!req.session.cart) {
    return res.redirect('shop/shopping-cart');
  }
  var cart = new Cart(req.session.cart);

  var stripe = require("stripe")("sk_test_9ilKltRSNlbS3WEMUBb0Tmxy");
  var token = req.body.stripeToken;

  console.log(req.user);

  var charge = stripe.charges.create({
    amount: cart.totalPrice * 100, // Amount in pence
    currency: "gbp",
    source: token,
    description: "Example charge"
  }, function(err, charge) {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('/checkout');
    }
    var order = new Order({
      user: req.user,
      cart: cart,
      address: req.body.address,
      name: req.body.name,
      paymentId: charge.id,
      status: "Order placed"
    });

    for ( var productID in cart.items ) {
      var itemQty = cart.items[productID].qty;
      var product = cart.items[productID].item;

      var newStockLevel = product.stockLevel - itemQty;

      Product.update({ _id: product._id }, { $set: { stockLevel: newStockLevel }}, function (err, raw) {
        //if (err) return handleError(err);
      });

    }
    order.save(function(err, result) {
      req.flash('success', 'Successfully bought product!');
      req.session.cart = null;
      res.redirect('/');
    });

    var toSmsNumber = "+44" + req.user.contactnumber.substring(1,req.user.contactnumber.length);

    client.messages.create({
        //  to: toSmsNumber, //actual customer phone number for production
          to: "07899992502", //test number for testing purposes
          from: fromSmsNumber,
          body: "Thankyou for your order with Sky Experiences.",
      }, function(err, message) {
          //console.log(message.sid);
      });
  });
})


router.post('/checkout-business', isLoggedIn, function(req, res, next) {
  if (!req.session.cart) {
    return res.redirect('shop/shopping-cart');
  }
  var cart = new Cart(req.session.cart)

  if (req.body.purchaseOrderNoBusiness == "") {
    var stripe = require("stripe")("sk_test_9ilKltRSNlbS3WEMUBb0Tmxy");
    var token = req.body.stripeToken;

    var charge = stripe.charges.create({
      amount: cart.totalPrice * 100, // Amount in pence
      currency: "gbp",
      source: token,
      description: "Example charge"
    }, function(err, charge) {
      if (err) {
        req.flash('error', err.message);
        return res.redirect('/checkout');
      }
      var order = new Order({
        user: req.user,
        cart: cart,
        address: req.body.addressBusiness,
        name: req.body.nameBusiness,
        paymentId: charge.id
      });
      for ( var productID in cart.items ) {
        var itemQty = cart.items[productID].qty;
        var product = cart.items[productID].item;

        var newStockLevel = product.stockLevel - itemQty;

        Product.update({ _id: product._id }, { $set: { stockLevel: newStockLevel }}, function (err, raw) {
          //if (err) return handleError(err);
        });
      }
      order.save(function(err, result) {
        req.flash('success', 'Successfully bought product!');
        req.session.cart = null;
        res.redirect('/');
      });
    });
  }
  else {
    var order = new Order({
      user: req.user,
      cart: cart,
      address: req.body.addressBusiness,
      name: req.body.nameBusiness,
      purchaseOrderNo: req.body.purchaseOrderNoBusiness
    });
    for ( var productID in cart.items ) {
      var itemQty = cart.items[productID].qty;
      var product = cart.items[productID].item;

      var newStockLevel = product.stockLevel - itemQty;

      Product.update({ _id: product._id }, { $set: { stockLevel: newStockLevel }}, function (err, raw) {
        //if (err) return handleError(err);
      });
    }
    order.save(function(err, result) {
      req.flash('success', 'Successfully bought product!');
      req.session.cart = null;
      res.redirect('/');
    });
  }
})


router.post('/search', function(req, res, next){

 var val = req.body.search;

 if (val != "") {
   searchCriteria = true;
   var successMsg = req.flash('success')[0];
   Product.find({$text:{$search: val}}, function(err, docs) {
     if(docs != null) {
       var productChunks = [];
       var chunkSize = 3;
       for (var i = 0; i < docs.length; i += chunkSize) {
         productChunks.push(docs.slice(i, i + chunkSize));
       }
       searchCriteria = false;
       res.render('shop/index', {title: 'Shopping Cart', products: productChunks, successMsg: successMsg, noMessage: !successMsg});
     } else {
       console.log("didn't find anything");
     }
     if (err) {
       console.log(err);
     }
   });
 }
});


router.post('/cancel-order', isLoggedIn, function(req, res, next) {
  Order.find({_id: req.body.order_id}, function(err, order) {
    if (err) {
      return res.write('Error!');
    }

    if (order) {

    Order.update({_id: req.body.order_id}, { $set: { status: "Cancelled"}
    }, function (err, raw) {
      if (err) return handleError(err);
    });
  }

});
  res.redirect('/user/profile');

});


module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/user/signin');
}
