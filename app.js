var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//var listingPage = require('./routes/listing_page');
var routes = require('./routes/index');
//var search = require('./routes/search');
//var product_details = require('./routes/product_details');
//var register = require('./routes/register_login');
//var browse = require('./routes/browse');
//var checkout = require('./routes/checkout');
//var shopping_cart = require('./routes/shopping_cart');
//var deals = require('./routes/deals');
//var modify_listing = require('./routes/modify_listing');
//var purchase_confirmation = require('./routes/purchase_confirmation');
//var account_items = require('./routes/account_items');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
//app.use('/search', search);
//app.use('/listing_page', listingPage);
//app.use('/product_details', product_details);
//app.use('/register', register);
//app.use('/browse', browse);
//app.use('/checkout', checkout);
//app.use('/shopping_cart', shopping_cart);
//app.use('/deals', deals);
//app.use('/modify_listing', modify_listing);
//app.use('/purchase_confirmation', purchase_confirmation);
//app.use('/account_items', account_items);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
