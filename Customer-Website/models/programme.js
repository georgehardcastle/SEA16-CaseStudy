var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  imagePath: {type: String, required: true},
  title: {type: String, required: true},
  schedule: {type: String, required: true},
  category: {type: String, required: true},
  description: {type: String, required: true}

});

schema.index({ title: 'text', description: 'text' });


module.exports = mongoose.model('Programme', schema);
