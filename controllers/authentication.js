const jwt = require('jwt-simple');
const User = require('../models/user'); // Mongoose model


function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({sub: user.id, iat: timestamp}, process.env.secret);
}


exports.signin = function(req, res, next) {
  // User has already had their email and password authenticated.
  // We just need to give them a token.
  
  res.send({token: tokenForUser(req.user)});
}

exports.signup = function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  
  if (!email || !password) {
    return res.status(422).send({error: "You must provide email and password"});
  }
  
  // See if a user with the given email exists.
  User.findOne({email: email}, function(err, existingUser) {
    if (err) {
      return next(err);
    }
    
    // If a user with the email exists, return an error (can't sign up with an email already there).
    if (existingUser) {
      return res.status(422).send({error: "Email is in use."});
    }
    
    // If a user with the email does not exist, create and save user record.
    const user = new User({
      email: email,
      password: password
    });
    
    user.save(function(err) { // save to database
      if (err) {
        return next(err);
      }
      
      // Respond to request indicating the user was created.
      res.json({token: tokenForUser(user)});
    });
    
  });
  
}

