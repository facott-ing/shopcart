var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');

var routes = require('./routes/index');
var users = require('./routes/users');


// listen port
var port = process.env.PORT || 1111;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);


// --------------------- + --------------------------------------------------
// app outside files requires
require('./DBconnection');
require('./DBschema');
// --------------------- + --------------------------------------------------



// OBJECTS RESPONSE
// --------------------- + --------------------------------------------------
// --------------------- + -------------------------------------------
// --------------------- + -------------------------------
// --------------------- + ---------------------

require('./require/product.app.js')(app);

// --------------------- + ---------------------
// --------------------- + -------------------------------
// --------------------- + -------------------------------------------
// --------------------- + --------------------------------------------------


// Render calls app
// --------------------- + --------------------------------------------------
// --------------------- + -------------------------------------------
// --------------------- + -------------------------------
// --------------------- + ---------------------
//PRINCIPAL
app.get('/', function(req, res){
    res.redirect('/cart')
});


//Create server
http.createServer(app).listen(port, function(){
 console.log('the app listen on port:' + port);
});
/*
app.listen(port)
*/