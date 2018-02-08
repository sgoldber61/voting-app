const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// Create local Strategy
const localOptions = {usernameField: 'email'};
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
  // Verify username and password, call done with the user
  // if it is the correct email and password
  // otherwise, call done with false
  
  User.findOne({email: email}, function(err, user) {
    if (err) {
      return done(err);
    }
    
    if (!user) {
      return done(null, false);
    }
    
    // compare passwords - is `password` equal to user.password?
    user.comparePassword(password, function(err, isMatch) {
      if (err) {return done(err);}
      
      if (!isMatch) {return done(null, false);}
      
      return done(null, user);
    });
  }); // use mongoose to find the email
  
});

// Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

// Create JWT JwtStrategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload/*decoded token, JwtStrategy knows how to decode*/, done) {
  User.findById(payload.sub/*user id*/, function(err, user) {
    if (err) {return done(err, false);}
    
    if (user) {
      done(null, user);
    }
    else {
      done(null, false);
    }
    
  });
});

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);


