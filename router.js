const PollOperations = require('./controllers/polls');
const AuthenticationOperations = require('./controllers/authentication');
const passportService = require('./services/passport');

const express = require('express');
const passport = require('passport');
const path = require('path');

const requireAuth = passport.authenticate('jwt', {session: false});
const requireSignin = passport.authenticate('local', {session: false});


module.exports = function(app) {
  // authentication operations
  app.post('/signin', requireSignin, AuthenticationOperations.signin);
  app.post('/signup', AuthenticationOperations.signup);
  
  // poll operations relying on PollOperations
  app.post('/create-poll', requireAuth, PollOperations.createPoll);
  app.delete('/delete-poll', requireAuth, PollOperations.deletePoll);
  app.put('/add-vote', requireAuth, PollOperations.addVote);
  
  app.get('/get-polls', PollOperations.getPolls);
  app.get('/get-user-polls', requireAuth, PollOperations.getUserPolls);
  app.get('/get-poll-data/:pollId', PollOperations.getPollData);
  
  app.use('/', express.static(`${__dirname}/client/build`));
  
  // express will serve up index.html if it doesn't recognize the route
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}


