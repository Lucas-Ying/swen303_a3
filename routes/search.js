var express = require('express');
var router = express.Router();

var itemListing = function(name, id, image, price){
  this.name = name;
  this.id = id;
  this.imagesrc = image;
  this.price = price;
}

router.get('/', function(req, res, next) {
  var results = [new itemListing("Toy", 1, "images/icon.bmp", 50), new itemListing("Shovel", 2, "images/icon.bmp", 30), new itemListing("Pencil", 3, "images/icon.bmp", 2)];
  res.render('search', { results: results });
  });

  module.exports = router;
