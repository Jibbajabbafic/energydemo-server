var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Energy Demonstration System', page: 'index'});
// });

router.get('/', function(req, res, next) {
  res.render('combined', { title: 'Energy Demonstration System', page: 'combined'});
});

router.get('/settings', function(req, res, next) {
  res.render('settings', { title: 'Energy Demonstration System', page: 'settings'});
});

/* GET advanced view. */
// router.get('/advanced', function(req, res, next) {
//   res.render('advanced', { title: 'Energy Demonstration System - Advanced View', page: 'advanced'});
// });

/* GET python data */
// router.get('/readSensor', function(req, res, next) {
  
// });

module.exports = router;
