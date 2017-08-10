'use strict';


const Users = require('../models/user.js');


function ClickHandler () {

  this.addClick = (req, res) => {
    Users.findOneAndUpdate({ 'github.id': req.user.github.id }, { $inc: { 'nbrClicks.clicks': 1 } })
      .exec( (err, result) => {
        if (err) throw err;

        res.json(result.nbrClicks);
      });
  };

  this.getClicks = (req, res) => {
    Users.findOne({ 'github.id': req.user.github.id }, { '_id': false })
      .exec( (err, result) => {
        if (err) throw err;

        res.json(result.nbrClicks);
      });
  };

  this.resetClicks = (req, res) => {
    Users.findOneAndUpdate({ 'github.id': req.user.github.id }, { 'nbrClicks.clicks': 0 })
      .exec( (err, result) => {
        if (err) throw err;

        res.json(result.nbrClicks);
      });
  };

};

module.exports = ClickHandler;
