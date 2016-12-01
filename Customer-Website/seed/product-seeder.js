var Product = require('../models/product');

var mongoose = require('mongoose');
mongoose.connect('localhost:27017/shopping');

var products = [
  new Product({
  imagePath: 'https://daf3s0t6x4iy1.cloudfront.net/fc4a04da-af60-4c22-a97a-b0ce6d64e56b/4053',
  title: 'Game of Thrones Tour for Two',
  description: 'Journey into the magical world of Westeros on a tour of Northern Ireland, and travel south of Belfast to see places like Winterfell, the Riverlands and King Robb’s camp on this Game of Thrones Southern Filming Locations Tour for Two. At the Castle Ward Estate you’ll explore over 20 filming locations from the show, including the gateway to Winterfell’s courtyard, the home of Walder Frey, the site of King Robb and Talisa’s wedding and more. A quick visit to St Patrick’s grave and you’re on to Inch Abbey, a picturesque spot where King Robb was crowned King in the North and your final stop on a fascinating behind-the-scenes trip.',
  price: 110,
  stockLevel: 100
  }),
  new Product({
  imagePath: 'https://daf3s0t6x4iy1.cloudfront.net/35ead093-0e18-44fe-b984-c8e443e47045/4014',
  title: 'STAR WARS Identities Exhibition at The O2',
  description: 'Get closer to the action with STAR WARS Identities at London’s O2. An exhibition from a galaxy far, far away comes to our very own for an experience that fans of the franchise will never forget. You’ll follow in the footsteps of cinema’s most famous father and son duo, Luke and Anakin Skywalker. Trace their journeys back to Tatooine, and meet the friends and mentors that shaped their differing paths into adulthood. This stunning collection of costumes, models, props and artwork allows you to see these two heroes as never before, as well as a host of unforgettable faces from the movies.',
  price: 99,
  stockLevel: 100
  }),
  new Product({
  imagePath: 'https://thinkwellgroup.com/wp-content/uploads/2012/09/Warner-Bros-Studio-Tour-London-The-Making-of-Harry-Potter-Attraction-featured.jpg',
  title: 'Warner Bros. Studio Tour London – The Making of Harry Potter',
  description: 'If you’re a Harry Potter fan, get an insight into the world of wizardry with the Warner Bros. Studio Tour London. Step into the Great Hall, Dumbldores office and the wand room with this thrilling tour of the Making of Harry Potter that takes you on to some beautiful sets from the most successful film series of all time. Explore the incredible Studio Tour, with the triple-decker Knight Bus and the Dursleys life-size house on Privet Drive and you will even have the chance to taste real Butterbeer and ride a broomstick!',
  price: 119,
  stockLevel: 100
  }),
  new Product({
  imagePath: 'http://www.chelseanews24.com/files/2015/05/WEMBLEY_STADIUM.jpg',
  title: 'Wembley Stadium Tour for Two',
  description: 'Take the Wembley Stadium Tour and walk in the footsteps of legendary players. Wembley Stadium, the home of English football and the FA Cup Final since 1923, re-opened to the public in 2007 and quickly re-established itself as the countrys leading venue for sports and entertainment events. Feel the magic and relive your greatest memories by going behind the scenes of the stadium that brought you so many magnificent football, sporting and music moments.',
  price: 40,
  stockLevel: 100
  }),
  new Product({
  imagePath: 'http://web4homes.com/ofest/Boats%20Turning%20Small%20file.jpg',
  title: 'Ocean Race Yacht Experience',
  description: 'Experience the thrill of yacht racing, aboard one of two identical 60ft Clipper 60 Race Yachts, on this fast moving, exhilarating day out. Perfect for novice sailors right through to the experienced yachtsmen or women; there is something for everyone during this action packed sailing trip. It’s all hands on deck as you hoist the giant sails and start to feel the incredible power of this special vessel as she makes her way under the drive of wind alone.',
  price: 149,
  stockLevel: 100
  }),
  new Product({
  imagePath: 'https://www.virginexperiencedays.co.uk/content/img/product/large/PSXFSS__01.jpg',
  title: 'Formula Silverstone Single Seater Experience',
  description: 'Experience the atmosphere of Silverstone from the cockpit of an exhilarating single seater, and feel like a genuine F1 racing driver with this exclusive Silverstone Single Seater Experience. Engineered to give you the F1 feeling without undergoing years of training, as soon as you’re in the seat of a Silverstone Single Seater you’ll start imagining yourself as the next Sebastian Vettel or Susie Wolff.',
  price: 150,
  stockLevel: 100
  }),
  new Product({
  imagePath: 'https://i.ytimg.com/vi/07h_C1KqTlE/maxresdefault.jpg',
  title: 'Festive Peppa Pig World Experience',
  description: 'Experience Peppa Pig World in a magical festive setting. Meet Santa in his magical grotto and many of his special friends along the way. See Sleigh Ride 4D at the Show Street Cinema. Join in our Christmas Show at our Show Stage, and enjoy a great selection of rides and attractions (See rides included). Also includes a special gift for children, hot punch & a festive treat for adults.',
  price: 40,
  stockLevel: 100
  }),
  new Product({
  imagePath: 'http://66.media.tumblr.com/db7ba3d409172b6e9a0a3b13926dc59e/tumblr_inline_nx7qg5OogB1tbtsob_1280.jpg',
  title: 'Disney On Ice - Frozen',
  description: 'Enter a wintry wonderland when Disney On Ice presents Frozen – now a full-length spectacular live on ice! Join Anna, Elsa, Olaf, Kristoff and Sven, on a journey to discover love is the most magical power of all. Dazzling effects, astonishing skating and special appearances by favourite Disney stars combine to create memories to last a lifetime. Experience the Full Story – Live on Ice!',
  price: 50,
  stockLevel: 100
  }),
  new Product({
  imagePath: 'http://www.thetopvillas.com/blog/wp-content/uploads/2015/12/LEGOLAND-Florida_NewChristmas_002.jpg',
  title: 'Lego Land - Christmas Bricktacular',
  description: 'Wonder at the twinkling lights, snow dusted pine trees, exciting seasonal festivities and see the Park as you have never seen it before, all with a sprinkling of magical LEGO® delights. Journey to the heart of the LEGOLAND Windsor Resort aboard the Bricksmas Express and discover a Christmas land with 20 rides and attractions. The highlight of your day will be meeting Father Christmas in his magical grotto, where every child will receive a LEGO gift!',
  price: 35,
  stockLevel: 100
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
