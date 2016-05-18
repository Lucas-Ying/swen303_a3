var express = require('express');
var router = express.Router();

var pg = require('pg').native;
var connectionString = "postgres://andy:mypassword@shop.cnidizu3p6xl.us-west-2.rds.amazonaws.com/shop";
var client = new pg.Client(connectionString);
client.connect();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
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