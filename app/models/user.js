'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const User = new Schema({
  github: {
  	id: String,
  	displayName: String,
  	username: String,
    publicRepos: Number
  },
  google: { //placeholder
  	id: String,
  	displayName: String
  },
  userInfo: {
    id: String,
  	displayName: String,
    loginAuth: String
  },
  nbrClicks: {
    clicks: Number
  }
});

module.exports = mongoose.model('User', User);