var Employee = require('../models/employee');

var mongoose = require('mongoose');
mongoose.connect('localhost:27017/shopping');

var employee = [
  new Employee({
    email: 'test@skyexperiences.com',
    password: 'test',
    firstname: 'John',
    lastname: 'Charles'
  }),
  new Employee({
    email: 'test1@skyexperiences.com',
    password: 'test',
    firstname: 'Tony',
    lastname: 'Smith'
  }),
  new Employee({
    email: 'test3@skyexperiences.com',
    password: 'test',
    firstname: 'Beth',
    lastname: 'Peters'
  })
];

var done = 0;
for (var i=0; i<employee.length; i++) {
  employee[i].save(function(err,result) {
    done++;
    if (done === employee.length) {
      exit();
    }
  });
}

function exit() {
  mongoose.disconnect();
}
