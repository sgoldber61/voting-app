const shortid = require('shortid');
const Poll = require('../models/poll'); // Mongoose model

// exports: createPoll, deletePoll, addVote, getPolls, getUserPolls

exports.createPoll = function(req, res, next) {
  // request body: title, options
  const title = req.body.title;
  const email = req.user.email;
  const options = req.body.options.map(name => {
    return {name, votes: 0};
  });
  
  if (!(title && email && options.length)) {
    return res.status(422).send({error: "You must provide title, email, and at least one option"});
  }
  
  const voters = [];
  const pollId = shortid.generate();
  
  const poll = new Poll({
    title,
    email,
    options,
    pollId,
    voters
  });
  
  poll.save(function(err) { // save to database
    if (err) {
      return next(err);
    }
    
    // Respond to request indicating the poll was created.
    res.json({message: "Poll was created"});
  });
  
};

exports.deletePoll = function(req, res, next) {
  // request body: pollId
  const pollId = req.body.pollId;
  const email = req.user.email; // to later verify that the poll's associated email matches the authenticated email
  
  // find the poll with the given pollId and email
  Poll.findOne({pollId, email}).remove(function(err, result) {
    if (err) {
      return next(err);
    }
    
    if (!result.n) {
      return res.status(422).send({error: "Poll doesn't exist or was unable to be deleted"});
    }
    
    // Respond to request indicating the poll was deleted.
    res.json({message: "Poll was deleted"});
  });
};

exports.addVote = function(req, res, next) {
  // request body: pollId, optionName
  const pollId = req.body.pollId;
  const optionName = req.body.optionName;
  const email = req.user.email;
  
  // find the poll with the given pollId
  Poll.findOne({pollId}).then(function(result) {
    // make sure user (email) hasn't already voted
    for (let i = 0; i < result.voters.length; i++) {
      if (email === result.voters[i])
        return res.status(422).send({error: "User has already voted"});
    }
    
    // make sure optionName exists, then update that option
    for (let i = 0; i < result.options.length; i++) {
      if (optionName === result.options[i].name) {
        // increaese result.options[i].votes
        result.options[i].votes++;
        
        // push user to the end of the "already voted" list
        result.voters.push(email);
        
        // save result
        result.save(function(err) { // save to database
          if (err) {
            return next(err);
          }
        });
        
        // Respond to request indicating the poll was updated.
        return res.json(result);
      }
    }
    
    return res.status(422).send({error: "Option does not exist"});
    
  }, function(err) {
    return next(err);
  });
  
  
};

exports.getPolls = function(req, res, next) {
  // return all polls
  Poll.find({}).select('title pollId').then(function(polls) {
    return res.json(polls);
  }, function(err) {
    return next(err);
  });
};

exports.getUserPolls = function(req, res, next) {
  // return all polls created by the given user
  const email = req.user.email;
  
  Poll.find({email}).select('title pollId').then(function(polls) {
    return res.json(polls);
  }, function(err) {
    return next(err);
  });
};

exports.getPollData = function(req, res, next) {
  // return poll data
  const pollId = req.params.pollId;
  
  Poll.findOne({pollId}).select('title pollId email options').then(function(pollData) {
    if (!pollData) {
      return res.status(422).send({error: "Poll does not exist"});
    }
    
    return res.json(pollData);
  }, function(err) {
    return next(err);
  });
};


