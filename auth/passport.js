// load the passport-local strategy
const LocalStrategy = require('passport-local').Strategy;

// load up the user database
const db = require('./db');

// expose this function to our app using module.exports
module.exports = function(passport) {

    /**
     * =======================================
     *  passport session setup
     * =======================================
     * enables persistent login sessions
     * passport needs to serialize and unserialize users out of session
     */

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        db.users.findById(id, (err, user) => {
            if (err) return done(err);
            done(null, user);
        })
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================

    passport.use('local-login', new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        (req, username, password, done) => { // callback with email and password from our form

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            
            db.users.findByUsername(username, (err, user) => {
                if (err) 
                    return done(err);

                if(!user) 
                    // return false if user doesn't exist
                    return done(null, false, req.flash('loginMessage', 'Invalid username')); // req.flash is the way to set flashdata using connect-flash)

                db.users.validPassword(password, user, (err, match) => {
                    // check if any errors occurred
                    if(err) 
                        return done(err);
                    
                    if (match) 
                        // on match send the user object
                        return done(null, user);
                    else 
                        // otherwise send false create the loginMessage and save it to session as flashdata
                        return done(null, false, req.flash('loginMessage', 'Invalid password'));
                });
            });
            // let user = Users.find(entry => entry.username === username);

            // // check if user exists
            // if (!user) return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash)
            
            // bcrypt.compare(password, user.passwordHash, (err, match) => {
            //     // check if any errors occurred
            //     if(err) 
            //         return done(err);
                
            //     if (match) 
            //         // on match return the user object
            //         return done(null, user);
            //     else 
            //         // otherwise create the loginMessage and save it to session as flashdata
            //         return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
            // });
        })
    );
};