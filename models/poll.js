const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define our mongoose model
const optionSchema = new Schema({
  name: String,
  votes: Number,
});

const pollSchema = new Schema({
  /*email: {type: String, unique: true, lowercase: true},
  password: String*/
  title: String,
  email: {type: String, lowercase: true},
  pollId: String,
  options: [optionSchema],
  voters: [{type: String, lowercase: true}]
});


// Create the model class
const ModelClass = mongoose.model('poll', pollSchema);


// Export the model
module.exports = ModelClass;

