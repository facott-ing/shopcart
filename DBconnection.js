// AppSystem - Mongo data base connection
var mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/shopping');

var connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error:'));