var express = require('express');
var router = express.Router();

var pg = require('pg').native;
var connectionString = "postgres://andy:mypassword@shop.cnidizu3p6xl.us-west-2.rds.amazonaws.com/shop";
var client = new pg.Client(connectionString);
client.connect();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('add_user', { title: 'Join' });
});

router.post('/', function (req, res) {
    var firstName = req.body.first_name;
    var lastName = req.body.last_name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    
    var query = client.query("SELECT MAX(UserID) FROM Users");
    var index;
    var newIndex;

    query.on('row', function (row) {
        index = JSON.parse(row.max);
        newIndex = (Number)(index + 1);
    });
 
    query.on('end', function () {
        client.query('INSERT INTO Users'
                  + ' (UserID, FirstName, LastName, UserHandle, Password, Email)'
                  + ' VALUES '
                  + ' ($1, $2, $3, $4, $5, $6)'
               , [newIndex, firstName, lastName, username, password,email]
               , function (err, result) {
               });
        res.render('user_confirmation', { firstName: firstName, username:username, id: newIndex });
    });
});



module.exports = router;