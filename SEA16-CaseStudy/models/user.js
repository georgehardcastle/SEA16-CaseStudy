var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var userSchema = new Schema({

  email: {type: String, required: true},
  password: {type: String, required: true},
  firstname: {type: String, required: false},
  lastname: {type: String, required: false},
  firstlineofaddress: {type: String, required: false},
  town: {type: String, required: false},
  postcode: {type: String, required: false},
  contactnumber: {type: String, required: false},
  accounttype: {type: String, required: false}  //use businesscustomer for business customers

});

userSchema.methods.encryptPassword = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', userSchema);
