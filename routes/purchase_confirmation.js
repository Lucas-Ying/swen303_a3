var express = require('express');
var router = express.Router();
//connect to db
var pg = require('pg').native;
var connectionString = "postgres://andy:mypassword@shop.cnidizu3p6xl.us-west-2.rds.amazonaws.com/shop";
var client = new pg.Client(connectionString);
client.connect();

router.get('/', function(req, res, next) {
    //var startIndex = req.request* 2;
    //var search = req.query.searchTerms;
    var test_id = req.param('id');
    var userId = req.param('account_id');
    var query = client.query("SELECT * FROM Items");
    var results = [];
    var id;
    var desc;
    var item_name;
    var price;
    var numItems;
    var sellerID;
    var images;
    var images2;
    var images3;
    var images4;
    var images5;
    var images6;

    // Stream results back one row at a time
    query.on('row', function(row) {
        if (row.listingid == test_id) {

            id = row.listingid;
            desc = row.description;
            item_name = row.itemname;
            images = row.images;
            images2 = row.images2;
            images3 = row.images3;
            images4 = row.images4;
            images5 = row.images5;
            images6 = row.images6;
            price = row.price;
            numItems = row.numitems;
            sellerID = row.sellerid;
        }
    });
    query.on('end', function () {

        var findIndex = client.query("SELECT MAX(ListingId) FROM Items");
        var index;
        var newIndex;

        findIndex.on('row', function (row) {
            index = JSON.parse(row.max);
            newIndex = (Number)(index + 1);
        });

        findIndex.on('end', function () {
            client.query("UPDATE items SET NumItems=$1 where listingID=$2", [numItems - 1, id])
            client.query("INSERT INTO Transactions"
                + " (ListingID, SellerID, BuyerID, Price, Transactions) VALUES"
                + "($1, $2, $3, $4, $5)"
                , [id, sellerID, userId, price, newIndex]);
        });


        res.render('purchase_confirmation',
            {
                desc: desc,
                id: id,
                price: price,
                item_name: item_name,
                numItems: numItems,
                sellerID: sellerID,
                images: images,
                images2: images2,
                images3: images3,
                images4: images4,
                images5: images5,
                images6: images6
            });
    });


});

module.exports = router;
