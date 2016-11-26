var Product = require('../models/product');

var mongoose = require('mongoose');
mongoose.connect('localhost:27017/shopping');

var products = [
  new Product({
  imagePath: 'http://clientimages.teamtalk.com/12/12/1024x768/1_2879175.jpg',
  title: 'Sky Cycle Team 1',
  description: 'Visit',
  price: 150
  }),
  new Product({
  imagePath: 'http://clientimages.teamtalk.com/12/12/1024x768/1_2879175.jpg',
  title: 'Sky Cycle Team 2',
  description: 'Velodrome',
  price: 150
  }),
  new Product({
  imagePath: 'http://clientimages.teamtalk.com/12/12/1024x768/1_2879175.jpg',
  title: 'Sky Cycle Team 3',
  description: 'Members',
  price: 150
  }),
  new Product({
  imagePath: 'http://clientimages.teamtalk.com/12/12/1024x768/1_2879175.jpg',
  title: 'Sky Cycle Team 4',
  description: 'Current',
  price: 150
  }),
  new Product({
  imagePath: 'http://clientimages.teamtalk.com/12/12/1024x768/1_2879175.jpg',
  title: 'Sky Cycle Team 5',
  description: 'Flump',
  price: 150
  }),
  new Product({
  imagePath: 'http://clientimages.teamtalk.com/12/12/1024x768/1_2879175.jpg',
  title: 'Sky Cycle Team 6',
  description: 'Lycra',
  price: 150
  }),
];

var done = 0;
for (var i=0; i<products.length; i++) {
  products[i].save(function(err,result) {
    done++;
    if (done === products.length) {
      exit();
    }
  });
}

function exit() {
  mongoose.disconnect();
}
