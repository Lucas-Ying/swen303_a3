var express = require('express');
var router = express.Router();
//connect to db
var pg = require('pg').native;
var connectionString = "postgres://andy:mypassword@shop.cnidizu3p6xl.us-west-2.rds.amazonaws.com/shop";
var client = new pg.Client(connectionString);
client.connect();

/* GET home page. */
// router.get('/', function(req, res, next) {
//     res.render('product_details', { title: 'Product Details' });
// });



// ListingID SERIAL,
//     ItemName VARCHAR(50),
//     Description VARCHAR(500),
//     Images VARCHAR(50),
//     Price DECIMAL,
//     Categories VARCHAR(50),
//     SellerID  SERIAL,
//     NumItems INTEGER


router.get('/', function(req, res, next) {
    //var startIndex = req.request* 2;
    //var search = req.query.searchTerms;
    var test_id = 1;
    var query = client.query("SELECT * FROM Items");
    var results = [];
    var id;
    var desc;
    var item_name;
    var price;
    var numItems;
    var sellerID;
    // Stream results back one row at a time
    query.on('row', function(row) {
        if (row.listingid == test_id) {
            //id = test_id;
            desc = row.description;
            console.log(desc);
            console.log("loop");
            item_name = row.itemname;
            price = row.price;
            numItems = row.NumItems;
            sellerID = row.SellerID;
        }
    });
    query.on('end', function() {
        res.render('product_details',
            {
                desc: desc,
                id: id,
                item_name: item_name,
                numItems: numItems,
                sellerID: sellerID
            });
    });


});



    module.exports = router;