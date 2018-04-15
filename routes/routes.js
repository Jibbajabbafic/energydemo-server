module.exports = (app, passport) => {
    /**
     * =================================
     *  HOME PAGE
     * =================================
     */
    app.get('/', function(req, res, next) {
        res.render('index.pug', { title: 'Home', page: 'index', authorised: req.isAuthenticated()});
    });

    /**
     * =================================
     *  LOGIN
     * =================================
     */
    // get login page
    app.get('/login', function(req, res, next){
        // console.log(res);

        // console.log(req.flash('loginMessage'));
        res.render('login.pug', { title: 'Login', page: 'login', message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/settings', // redirect to the secure settings section
        failureRedirect : '/login', // redirect back to the login page if there is an error
        failureFlash : true // allow flash messages
    }));

    /**
     * =================================
     *  SETTINGS
     * =================================
     */
    app.get('/settings', isLoggedIn, function(req, res, next) {
        res.render('settings.pug', { title: 'Settings', page: 'settings'});
    });

    /**
     * =================================
     *  LOGOUT
     * =================================
     */
    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    })
};

// router middleware to check if user authenticated
function isLoggedIn(req, res, next) {
    // if user authenticated, carry on
    if (req.isAuthenticated())
        return next();

    // otherwise redirect to login page
    res.redirect('/login');
}
