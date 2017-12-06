var express = require('express');
var router = express.Router();

var dataArray = {
  test: [],
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Energy Demonstration System', page: 'index'});
});

/* GET advanced view. */
router.get('/advanced', function(req, res, next) {
  res.render('advanced', { title: 'Energy Demonstration System - Advanced View', page: 'advanced'});
});

/* GET python data */
router.get('/readSensor', function(req, res, next) {
  
});

module.exports = router;
