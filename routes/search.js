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
  var search;
  if(req.query.q){
    search = req.query.q.toLowerCase();
  }
  else if(search){
    search = req.param.searchTerm.toLowerCase();
  }
  else{
    //TODO error message
    search = "";
  }

  var sort = req.param('sort');
  var query;
  if (sort === "price_asc") {
      query = client.query("SELECT * FROM Items ORDER BY Price Asc", function (err, result) {});
  } else if (sort === "price_desc") {
      query = client.query("SELECT * FROM Items ORDER BY Price desc", function (err, result) {});
      }
  else if (sort === "name") {
      query = client.query("SELECT * FROM Items ORDER BY ItemName Asc", function (err, result) {});
  }
  else{
      query = client.query("SELECT * FROM Items", function (err, result) {});
  }
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
    res.render('search', { results: results, search: search });
  });


  });

  module.exports = router;
