'use strict';

const dir = process.cwd();

const ClickHandler = require(dir + '/app/controllers/clickHandler.server.js');

module.exports = function(app, passport) {
  let clickHandler = new ClickHandler();


  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    else { res.redirect('/login'); }
  }


  app.route('/')
    .get(isLoggedIn, (req, res) => {
      res.sendFile(dir + '/public/index.html');
    });

  app.route('/login')
    .get( (req, res) => {
      res.sendFile(dir + '/public/login.html');
    });

  app.route('/logout')
    .get( (req, res) => {
      req.logout();
      res.redirect('/login');
    });

  app.route('/profile')
    .get(isLoggedIn, (req, res) => {
      res.sendFile(dir + '/public/profile.html');
    });

  app.route('/api/:id')
    .get(isLoggedIn, (req, res) => {
      res.json(req.user);
    });

  app.route('/auth/github')
    .get(passport.authenticate('github'));

  app.route('/auth/github/callback')
    .get(passport.authenticate('github', {
      successRedirect: '/',
      failureRedirect: '/login'
    }));

  app.route('/auth/google')
    .get(passport.authenticate('google', { scope: ['profile'] }));

  app.route('/auth/google/callback')
    .get(passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
      res.redirect('/');
    });

  app.route('/api/:id/clicks')
    .get(isLoggedIn, clickHandler.getClicks)
    .post(isLoggedIn, clickHandler.addClick)
    .delete(isLoggedIn, clickHandler.resetClicks);

};
