var express = require('express');
var router = express.Router();

var pg = require('pg').native;
var connectionString = "postgres://andy:mypassword@shop.cnidizu3p6xl.us-west-2.rds.amazonaws.com/shop";
var client = new pg.Client(connectionString);
client.connect();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'GoShop - online shopping for automotive, furniture, games, and more...' });
});

router.get('/test_database', function(request, response) {
// SQL Query > Select Data
  var query = client.query("SELECT * FROM users");
  var results = [];
// Stream results back one row at a time
  query.on('row', function(row) {
    results.push(row);
  });
// After all data is returned, close connection and return results
  query.on('end', function() {
    response.json(results);
  });
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Join' });
});

//======================== Listing Page =====================//
router.get('/listing_page', function(req, res, next) {
  res.render('listing_page', { title: 'Add a listing' });
});

router.post('/listing_page', function (req, res) {
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
});
//===================================================================//

//======================== Search Page =====================//
var maxResultsPerPage = 2;

var itemListing = function (name, id, image, price, qty) {
  this.name = name;
  this.listingId = id;
  this.imagesrc = image;
  this.price = price;
  this.quantity = qty;
};


router.get('/search', function (req, res, next) {
  //var startIndex = req.request* 2;
  var search = req.query.q.toLowerCase();

  var query = client.query("SELECT * FROM Items");
  var results = [];
  // Stream results back one row at a time
  query.on('row', function (row) {
    if (row.itemname.toLowerCase().indexOf(search) > -1 || row.description.toLowerCase().indexOf(search) > -1) {
      var image = row.images;

      if (row.images === "Default") {
        image = "images/icon.bmp";
      }
      var listing = new itemListing(row.itemname, row.listingid, image, row.price, row.numitems)
      results.push(listing);
    }
  });
  //results.splice(startIndex, maxResultsPerPage);
  // After all data is returned, close connection and return results
  query.on('end', function () {
    res.render('search', {results: results});
  });


});
//===================================================================//

//======================== Product details =====================//
router.get('/product_details/:id', function(req, res, next) {
  //var startIndex = req.request* 2;
  //var search = req.query.searchTerms;
  var test_id = req.params.id;
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
  query.on('end', function() {
    res.render('product_details',
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
//===================================================================//

//======================== Browse =====================//
router.get('/browse', function (req, res, next) {
  var category = req.param('category');
  var sort = req.param('sort');
  var query;
  if (sort === "price_asc") {
    query = client.query("SELECT * FROM Items WHERE Categories=$1 ORDER BY Price Asc", [category], function (err, result) {});
  } else if (sort === "price_desc") {
    query = client.query("SELECT * FROM Items WHERE Categories=$1 ORDER BY Price desc", [category], function (err, result) {});
  }
  else if (sort === "name") {
    query = client.query("SELECT * FROM Items WHERE Categories=$1 ORDER BY ItemName Asc", [category], function (err, result) {});
  }
  else{
    query = client.query("SELECT * FROM Items WHERE Categories=$1", [category], function (err, result) { });
  }
  var results = [];
  // Stream results back one row at a time
  query.on('row', function(row) {
    if (row.numitems>0) {
      var listing = new itemListing(row.itemname, row.listingid, row.images, row.price, row.numitems, row.quantity)
      results.push(listing);
    }
  });

  // After all data is returned, close connection and return results
  query.on('end', function() {
    res.render('browse', { category: category, results: results });
  });

});
//===================================================================//

//======================== Check Out =====================//
router.get('/checkout', function(req, res, next) {
  res.render('checkout', { title: 'Checkout' });
});
//===================================================================//

//======================== Shopping Cart =====================//
router.get('/shopping_cart', function(req, res, next) {
  res.render('shopping_cart', { title: 'Shopping Cart' });
});
//===================================================================//

//======================== Deals =====================//
router.get('/deals', function (req, res, next) {


  var query = client.query("SELECT * FROM Items WHERE Price<30 ORDER BY price", function (err, result) {

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
//===================================================================//

//======================== Modify Listing =====================//
router.get('/modify_listing', function (req, res, next) {
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

router.post('/modify_listing', function (req, res) {
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
//===================================================================//

//======================== Purchase Confirmation =====================//
router.get('/purchase_confirmation', function(req, res, next) {
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
//===================================================================//

//======================== Account Items =====================//
router.get('/account_items', function (req, res, next) {
  var accountId = req.param('account_id');
  var type = req.param('type');
  var query;
  if (type === "current") {
    query = client.query("SELECT * FROM Items WHERE SellerID=$1", [accountId], function (err, result) { });
  } else if (type === "sold") {
    query = client.query("SELECT * FROM Items"
        + " INNER JOIN Transactions"
        + " on Transactions.ListingId = Items.ListingID"
        + " WHERE Transactions.SellerId = $1", [accountId]);
  }
  else if (type === "bought") {
    query = client.query("SELECT * FROM Items"
        + " INNER JOIN Transactions"
        + " on Transactions.ListingId = Items.ListingID"
        + " WHERE Transactions.BuyerID = $1", [accountId]);
  }
  var results = [];
  // Stream results back one row at a time
  query.on('row', function (row) {
    var listing = new itemListing(row.itemname, row.listingid, row.images, row.price, row.numitems, row.quantity)
    results.push(listing);
  });
  // After all data is returned, close connection and return results
  query.on('end', function () {
    res.render('account_items', { type: type, results: results });
  });

});
//===================================================================//

//========================RESTful API for users =====================//






//========================RESTful API for users =====================//
//get users
router.get('/get_users', function (req,res){
  var userName = req.body.name;

  var query = client.query("select * from users");
  var results =[];

  //error handler for /get_users
  query.on('error',function(){
    res.status(500).send('Error, fail to get users: '+userName);
  });

  //stream results back one row at a time
  query.on('row',function(row){
    results.push(row);
  });

  //After all data is returned, close connection and return results
  query.on('end',function(){
    res.json(results);
    console.log("result: "+results);
  });
});

//adding users
router.post('/add_user', function(req, res){
  var firstName = req.body.first_name;
  var lastName = req.body.last_name;
  var email = req.body.email;
  var username = req.body.name;
  var password = req.body.pass;

  var queryid = client.query("SELECT MAX(UserID) FROM Users");
  var index;
  var newIndex;

  queryid.on('row', function (row) {
    index = JSON.parse(row.max);
    newIndex = (Number)(index + 1);
  });

  //error handler for /add_user
  queryid.on('error',function(){
    res.status(500).send('Error to get user index.');
  });

  var q = "insert into users (userd, firstname,lastname,userhandle,password,email) values ($1,$2,$3,$4,$5,$6) RETURNING userid,firstname,lastname,userhandle,password,email";
  var query = client.query(q, [newIndex, firstName, lastName,username,password,email]);
  var results =[];

  //error handler for /add_user
  query.on('error',function(){
    res.status(500).send('Error, fail to add user Name: '+username);
  });

  //stream results back one row at a time
  query.on('row',function(row){
    results.push(row);
  });

  //after all the data is returned close connection and return result
  query.on('end',function(){
    res.json(results);
    console.log("result: "+results);
  });
});

//router.post('/add_user', function (req, res) {
//  var firstName = req.body.first_name;
//  var lastName = req.body.last_name;
//  var email = req.body.email;
//  var username = req.body.username;
//  var password = req.body.password;
//
//  var query = client.query("SELECT MAX(UserID) FROM Users");
//  var index;
//  var newIndex;
//
//  query.on('row', function (row) {
//    index = JSON.parse(row.max);
//    newIndex = (Number)(index + 1);
//  });
//
//  query.on('end', function () {
//    client.query('INSERT INTO Users'
//        + ' (UserID, FirstName, LastName, UserHandle, Password, Email)'
//        + ' VALUES '
//        + ' ($1, $2, $3, $4, $5, $6)'
//        , [newIndex, firstName, lastName, username, password,email]
//        , function (err, result) {
//        });
//    res.render('user_confirmation', { firstName: firstName, username:username, id: newIndex });
//  });
//});

//===================================================================//

//========================RESTful API for Product ====================//
//get items
router.get('/get_product', function (req,res){
//  var productName = req.body.name;

  var query = client.query("select * from items");
  var results =[];

  //error handler for /get_product
  query.on('error',function(){
    res.status(500).send('Error, fail to get product: '+productName);
  });

  //stream results back one row at a time
  query.on('row',function(row){
    results.push(row);
  });

  //After all data is returned, close connection and return results
  query.on('end',function(){
    res.json(results);
    console.log("result: "+results);
  });
});

//adding product
router.put('/add_product', function(req, res){
  var productName = req.body.name;
  var productCost = req.body.cost;
  var productDes = req.body.description;
  // console.log("add product request");
  console.log("name: " + productName + " cost: " + productCost + " Description: " + productDes);
  var q = "insert into items (name,cost,description) values ($1,$2,$3) RETURNING id,name,cost,description";
  var query = client.query(q, [productName,productCost,productDes]);
  var results =[];

  //error handler for /add_product
  query.on('error',function(){
    res.status(500).send('Error, fail to add product product: '+productName);
  });

  //stream results back one row at a time
  query.on('row',function(row){
    results.push(row);
  });

  //after all the data is returned close connection and return result
  query.on('end',function(){
    res.json(results);
    console.log("result: "+results);
  });
});


//update product
router.post('/update_product', function(req, res){
  var productId = req.body.id;
  var productName = req.body.name;
  var productCost = req.body.cost;
  var productDes = req.body.description;

  var q = "update items set name = $1, cost = $2, description = $3 where id = $4 RETURNING id,name,cost,description";
  var query = client.query(q, [productName,productCost,productDes,productId]);
  var results =[];

  //error handler for /update_product
  query.on('error',function(){
    res.status(500).send('Error, fail to update product id:'+productId +' product: '+productName);
  });

  //stream results back one row at a time
  query.on('row',function(row){
    results.push(row);
  });

  //after all the data is returned close connection and return result
  query.on('end',function(){
    res.json(results);
    console.log("result: "+results);
  });
});


//delete product
router.delete('/delete_product', function(req, res){
  var productId = req.body.id;

  var q = "delete from items where id = $1 RETURNING id,name,cost,description";
  var query = client.query(q, [productId]);
  var results =[];

  //error handler for /delete_product
  query.on('error',function(){
    res.status(500).send('Error, fail to delete product id:'+productId +' product: '+productName);
  });

  //stream results back one row at a time
  query.on('row',function(row){
    results.push(row);
  });

  //after all the data is returned close connection and return result
  query.on('end',function(){
    res.json(results);
    console.log("result: "+results);
  });
});

//===================================================================//


module.exports = router;