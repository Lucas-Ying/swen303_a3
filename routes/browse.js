var express = require('express');
var router = express.Router();

var pg = require('pg').native;
var connectionString = "postgres://andy:mypassword@shop.cnidizu3p6xl.us-west-2.rds.amazonaws.com/shop";
var client = new pg.Client(connectionString);
client.connect();

/* GET home page. */
router.get('/:category', function (req, res, next) {
    var category = req.params.category;

    var query = client.query("SELECT * FROM Items WHERE Categories=$1", [category], function (err, result) {

    });
    console.log(query);

  res.render('browse', { category: category });
});

module.exports = router;