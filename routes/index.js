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

module.exports = router;