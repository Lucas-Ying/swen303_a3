var express = require('express');
var router = express.Router();

var pg = require('pg').native;
var connectionString = "postgres://andy:mypassword@shop.cnidizu3p6xl.us-west-2.rds.amazonaws.com/shop";
var client = new pg.Client(connectionString);
client.connect();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('listing_page', { title: 'Add a listing' });
});

router.post('/', function (req, res) {
    var name = req.body.product_name;
    var desc = req.body.description;
    var image = req.body.imageLink;
    var price = req.body.price;
    var category = req.body.category;
    var numItems = req.body.numItems;
    var sellerId = 1;

    var query = client.query("SELECT MAX(ListingId) FROM Items");
    var currentIndex;

    query.on('row', function (row) {
        currentIndex = Number.parseInt(row.max, 10);
        console.log("Row.max type: " +typeof (row.max));
        console.log("Current type: " + typeof (currentIndex));
        console.log("Current: " + currentIndex);
        console.log("Index in row: " +row.max);
    });
    var newIndex = currentIndex++;
    console.log("Index: " +newIndex);
 
    query.on('end', function () { });

    client.query('INSERT INTO Items'
              + ' (ListingId, ItemName, Description, Images, Price, Categories, SellerID, NumItems)'
              + ' VALUES '
//              + '(36, "Spoon", "Spoony","12345.jpg", 12, "auto", 1, 2)'
             + ' ($8, $1, $2, $3, $4, $5, $6, $7)'
//           , [name, desc, image, price, category, sellerId, numItems, 36]
              , ['Spoon', 'Spoony','12345.jpg', 12, 'auto', 1, 2, 36]   
            , function (err, result) {
                console.log("Inserting");
                console.log(result);
            });
    var query = client.query("SELECT MAX(ListingId) FROM Items");
    var currentIndex;
    query.on('row', function (row) {
        currentIndex = row.max;
        console.log("Index in row(end): " + row.max);
    });
});

module.exports = router;