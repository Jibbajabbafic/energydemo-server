var express = require('express');
var router = express.Router();

/**
 * =================================
 *  HOME PAGE
 * =================================
 */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Energy Demonstration System', page: 'index'});
});

/**
 * =================================
 *  LOGIN
 * =================================
 */
// get login page
// router.get('/login', function(req, res, next){
//    res.render('login', { message: req.flash('loginMessage') });
// });

// process login requests
// router.post('/login', do passport stuff here);

/**
 * =================================
 *  SETTINGS
 * =================================
 */
router.get('/settings', isLoggedIn, function(req, res, next) {
    res.render('settings', { title: 'Energy Demonstration System', page: 'settings'});
});

/**
 * =================================
 *  LOGOUT
 * =================================
 */
router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
})

// router middleware to check if user authenticated
function isLoggedIn(req, res, next) {
    // if user authenticated, carry on
    if (req.isAuthenticated())
        return next();

    // otherwise redirect to login page
    res.redirect('/login');
}

module.exports = router;
