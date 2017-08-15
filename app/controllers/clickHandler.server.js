'use strict';


const Users = require('../models/user.js');


function ClickHandler () {

  this.addClick = (req, res) => {
    Users.findOneAndUpdate({ 'userInfo.id': req.user.userInfo.id }, { $inc: { 'nbrClicks.clicks': 1 } })
      .exec( (err, result) => {
        if (err) throw err;

        res.json(result.nbrClicks);
      });
  };

  this.getClicks = (req, res) => {
    Users.findOne({ 'userInfo.id': req.user.userInfo.id }, { '_id': false })
      .exec( (err, result) => {
        if (err) throw err;

        res.json(result.nbrClicks);
      });
  };

  this.resetClicks = (req, res) => {
    Users.findOneAndUpdate({ 'userInfo.id': req.user.userInfo.id }, { 'nbrClicks.clicks': 0 })
      .exec( (err, result) => {
        if (err) throw err;

        res.json(result.nbrClicks);
      });
  };

};

module.exports = ClickHandler;
