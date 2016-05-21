var express = require('express');
var router = express.Router();

var pg = require('pg').native;
var connectionString = "postgres://andy:mypassword@shop.cnidizu3p6xl.us-west-2.rds.amazonaws.com/shop";
var client = new pg.Client(connectionString);
client.connect();


var itemListing = function(name, id, image, price, qty){
    this.name = name;
    this.listingId = id;
    this.imagesrc = image;
    this.price = price;
    this.quantity = qty;
}

/* GET home page. */
router.get('/', function (req, res, next) {


    var query = client.query("SELECT * FROM Items WHERE Price<50", function (err, result) {

    });
    console.log(query);

    var results = [];
    // Stream results back one row at a time
    query.on('row', function(row) {
        var listing = new itemListing(row.itemname, row.listingid, row.images, row.price, row.numitems, row.quantity)
        results.push(listing);
    });

    // After all data is returned, close connection and return results
    query.on('end', function() {
        res.render('deals', { results: results });
    });

});

module.exports = router;
