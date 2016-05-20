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
    var price = (Number)(req.body.price);
    var category = req.body.category;
    var numItems = (Number)(req.body.numItems);
    var sellerId = 1;

    var query = client.query("SELECT MAX(ListingId) FROM Items");
    var index;
    var newIndex;

    query.on('row', function (row) {
        index = JSON.parse(row.max);
        newIndex = (Number)(index + 1);
    });
 
    query.on('end', function () {
        client.query('INSERT INTO Items'
                  + ' (ListingId, ItemName, Description, Images, Price, Categories, SellerID, NumItems)'
                  + ' VALUES '
                  + ' ($1, $2, $3, $4, $5, $6, $7, $8)'
               , [newIndex, name, desc, image, price, category, sellerId, numItems]
               , function (err, result) {
               });
        res.render('listing_confirmation', { id: newIndex });
    });


    //redirect to confirmation page - link to listing page?
});



module.exports = router;