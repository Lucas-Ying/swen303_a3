var express = require('express');
var router = express.Router();

var pg = require('pg').native;
var connectionString = "postgres://andy:mypassword@shop.cnidizu3p6xl.us-west-2.rds.amazonaws.com/shop";
var client = new pg.Client(connectionString);
client.connect();

/* GET home page. */
router.get('/', function (req, res, next) {
    var listingId = req.param('id');

//    console.log(listingId);
    var query = client.query("Select * from Items where ListingId=$1", [listingId], function (err, res) { });
    var listingName;
    var description;
    var listingImage;
    var listingPrice;
    var listingCategory;
    var listingNumItems;
//    console.log(query);


    query.on('row', function (row) {
//        console.log(row);
        listingName = row.itemname;
        console.log(listingName);
        description = row.description;
        listingImage = row.images;
        listingPrice = row.price;
        listingCategory = row.categories;
        listingNumItems = row.numitems;
    });

    query.on('end', function () {
        res.render('modify_listing', {
            title: 'Modify listing', id: listingId, name: listingName, desc: description, image: listingImage,
            price: listingPrice, category: listingCategory, num: listingNumItems
        });
    });
});

router.post('/', function (req, res) {
    var id = req.param('id');
    var name = req.body.product_name;
    var desc = req.body.description;
    var image = req.body.imageLink;
    var price = (Number)(req.body.price);
    var category = req.body.category;
    var numItems = (Number)(req.body.numItems);
    console.log(numItems);
    
    client.query('UPDATE Items'
              + ' SET ItemName=$1,Description=$2, Images=$3, Price=$4, Categories=$5, NumItems=$6'
              + ' WHERE ListingId=$7'
           , [name, desc, image, price, category, numItems, id]
           , function (err, result) {
               console.log("Result: "+result);
           });
    res.render('modify_confirmation', { id: id });
});




module.exports = router;