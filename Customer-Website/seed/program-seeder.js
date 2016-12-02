var Programme = require('../models/programme');

var mongoose = require('mongoose');
mongoose.connect('localhost:27017/shopping');

var programmes = [
  new Programme({
  imagePath: 'http://www.sky.com/shop/export/sites/www.sky.com/shop/__12ColImages/Sports/WhatsOn/TopPicks/December_16/Football/Premier_League/prem_man_utd_v_spurs_356x200.jpg_896750466.jpg',
  title: 'Premier League: Man Utd v Tottenham Hotspur',
  schedule: 'Saturday 11th December, 2:15pm',
  category: 'Football',
  description: 'Two sides pushing for Champions League qualification and beyond match up as Tottenham Hotspur travel to Old Trafford to face Manchester United in this classic Premier League encounter.'
}),
new Programme({
imagePath: 'http://www.sky.com/shop/export/sites/www.sky.com/shop/__12ColImages/Sports/WhatsOn/TopPicks/December_16/Football/Premier_League/prem_man_city_v_chelsea_356x200.jpg_896747519.jpg',
title: 'Premier League: Man City v Chelsea',
schedule: 'Saturday 3rd December, 12:30pm',
category: 'Football',
description: 'One of the biggest encounters in the Premier League so far this season sees two in-form title contenders meet at the Etihad Stadium. With several teams running closely at the top of the league, 3 points in this one will be a particularly valuable prize.'
}),
new Programme({
imagePath: 'http://www.sky.com/shop/export/sites/www.sky.com/shop/__12ColImages/Sports/WhatsOn/TopPicks/December_16/Football/Premier_League/prem_liverpool_v_west_ham_356x200.jpg_896743643.jpg',
title: 'Premier League: Liverpool v West Ham',
schedule: 'Sunday 11th December, 4:30pm',
category: 'Football',
description: 'An underperforming West Ham face a difficult task as they travel to Anfield to face a free-scoring Liverpool with their sights set on a first Premier League title.'
}),
new Programme({
imagePath: 'https://i.ytimg.com/vi/g4CjMFMINno/maxresdefault.jpg',
title: 'The Yound Pope',
schedule: 'Thursday 8th December, 9:00pm',
category: 'Atlantic',
description: 'Lenny Belardo, the youngest and first American Pope in the history of the Church, must establish his new papacy and navigate the power struggles of the closed, secretive Vatican. Jude Law and Diane Keaton star in this eight part modern-day drama created by Academy Award® winning director Paolo Sorrentino. '
}),
new Programme({
imagePath: 'https://www.sky.com/assets2/westworld-tile-a3576d50.jpg',
title: 'Westworld',
schedule: 'Tuesday 6th December, 9:00pm',
category: 'Atlantic',
description: 'In a futuristic theme park staffed by artificial beings, guests can live out their wildest fantasies. However, when the robots begin to run amok, the guests find themselves in a world where anything can happen...'
}),
new Programme({
imagePath: 'http://www.posters.cz/image/750/21034.jpg',
title: 'Game of Thrones',
schedule: 'Saturday 3rd December, 10:05pm',
category: 'Atlantic',
description: 'An epic tale of lust, treachery, and bloodshed follows seven noble families as they fight for control of the kingdom of Westeros.'
})
];



var done = 0;
for (var i=0; i<programmes.length; i++) {
  programmes[i].save(function(err,result) {
    done++;
    if (done === programmes.length) {
      exit();
    }
  });
}

function exit() {
  mongoose.disconnect();
}
