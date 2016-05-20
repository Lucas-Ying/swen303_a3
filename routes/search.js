var express = require('express');
var router = express.Router();
//connect to db
var pg = require('pg').native;
var connectionString = "postgres://andy:mypassword@shop.cnidizu3p6xl.us-west-2.rds.amazonaws.com/shop";
var client = new pg.Client(connectionString);
client.connect();

var maxResultsPerPage = 2;


var itemListing = function(name, id, image, price, qty){
  this.name = name;
  this.listingId = id;
  this.imagesrc = image;
  this.price = price;
  this.quantity = qty;
}

router.get('/', function(req, res, next) {
  //var startIndex = req.request* 2;
  var search = req.query.q.toLowerCase();

  var query = client.query("SELECT * FROM Items");
  var results = [];
  // Stream results back one row at a time
  query.on('row', function(row) {
    if(row.itemname.toLowerCase().indexOf(search) > -1 || row.description.toLowerCase().indexOf(search) > -1){
      var image = row.images;

      if(row.images === "Default"){
        image = "images/icon.bmp";
      }
      var listing = new itemListing(row.itemname, row.listingid, image, row.price, row.numitems)
      results.push(listing);
    }
  });
  //results.splice(startIndex, maxResultsPerPage);
  // After all data is returned, close connection and return results
  query.on('end', function() {
    res.render('search', { results: results });
  });


  });

  module.exports = router;
