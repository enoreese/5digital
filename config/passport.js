const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const config = require('./secret');
const User = require('../models/user');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


/* Sign in using Email and Password */
passport.use('local-login', new LocalStrategy({
  // by default, local strategy uses username and password, we will override with email
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback : true // allows us to pass back the entire request to the callback
}, function(req, email, password, done) { // callback with email and password from our form
  console.log(email)

  // find a user whose email is the same as the forms email
  // we are checking to see if the user trying to login already exists
  User.findOne({ email:  email }, function(err, user) {
    // if there are any errors, return the error before anything else
    if (err)
    return done(err);
    console.log('inside passport')

    // if no user is found, return the message
    if (!user)
    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
    console.log('pass no user found')
    // if the user is found but the password is wrong
    if (!user.comparePassword(password))
    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
    console.log('pass password create')
     // Make sure the user has been verified
    if (!user.isVerified) 
    return done(null, false, req.flash('loginMessage', 'Your account has not been verified!')); 
    console.log('pass isVerified')
 
    // all is well, return successful user
    return done(null, user);
  });

}));


exports.isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login');
}
