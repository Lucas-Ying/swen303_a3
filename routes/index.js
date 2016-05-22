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