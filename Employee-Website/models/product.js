var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  imagePath: {type: String, required: true},
  title: {type: String, required: true},
  description: {type: String, required: true},
  price: {type: Number, required: true},
  stockLevel: {type: Number, required: true}
});

schema.index({ title: 'text', description: 'text' });


module.exports = mongoose.model('Product', schema);
