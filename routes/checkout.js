var express = require('express');
var router = express.Router();
//connect to db
var pg = require('pg').native;
var connectionString = "postgres://andy:mypassword@shop.cnidizu3p6xl.us-west-2.rds.amazonaws.com/shop";
var client = new pg.Client(connectionString);
client.connect();

var maxResultsPerPage = 2;



/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('checkout', { title: 'Checkout' });
});

module.exports = router;
