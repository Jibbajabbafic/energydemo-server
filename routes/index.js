var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Energy Demonstration System' });
});

/* GET advanced view. */
router.get('/advanced', function(req, res, next) {
  res.render('advanced', { title: 'Energy Demonstration System - Advanced View' });
});

module.exports = router;
