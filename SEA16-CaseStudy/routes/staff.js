var express = require('express');
var router = express.Router();

router.get('/home', function (req, res, next) {
  res.render('staff/home');
});

module.exports = router;
