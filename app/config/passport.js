'use strict';

const configAuth = require('./auth'),
      GitHubStrategy = require('passport-github').Strategy,
      GoogleStrategy = require('passport-google-oauth20').Strategy,
      LocalStrategy = require('passport-local').Strategy,
      User = require('../models/user');


module.exports = passport => {

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  passport.use('github', new GitHubStrategy({

    clientID: configAuth.githubAuth.clientID,
    clientSecret: configAuth.githubAuth.clientSecret,
    callbackURL: configAuth.githubAuth.callbackURL

  }, (accessToken, refreshToken, profile, done) => {
    process.nextTick(() => {
      User.findOne({
        'github.id': profile.id
      }, (err, user) => {
        if (err) return done(err);

        if (user) return done(null, user);
        else {
          const newUser = new User();

          newUser.loginAuth = 'github';

          newUser.github.id = profile.id;
          newUser.github.username = profile.username;
          newUser.github.displayName = profile.displayName;
          newUser.github.publicRepos = profile._json.public_repos;

          newUser.nbrClicks.clicks = 0;

          newUser.save(err => {
            if (err) throw err;

            return done(null, newUser);
          });

        }
      });
    });
  }));

  passport.use('google', new GoogleStrategy({

    clientID: configAuth.googleAuth.clientID,
    clientSecret: configAuth.googleAuth.clientSecret,
    callbackURL: configAuth.googleAuth.callbackURL

  }, (accessToken, refreshToken, profile, done) => {
    process.nextTick(() => {
      User.findOne({
        'google.id': profile.id
      }, function (err, user) {
        if (err) return done(err);

        if (user) return done(null, user);
        else {
          const newUser = new User();

          newUser.loginAuth = 'google';

          newUser.google.id = profile.id;
          newUser.google.displayName = profile.displayName;

          newUser.nbrClicks.clicks = 0;

          newUser.save(err => {
            if (err) throw err;

            return done(null, newUser);
          });

        }
      });
    });
  }));

  passport.use('local-login', new LocalStrategy({

    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,

  }, (req, email, password, done) => {
    process.nextTick(() => {
      User.findOne({
        'local.email': email.toLowerCase()
      }, (err, user) => {
        if (err)
          return done(err);

        if (!user)
          return done(null, false, req.flash('loginMessage', 'EMAIL/Password combination not found.'));

        if (!user.validPassword(password))
          return done(null, false, req.flash('loginMessage', 'Email/PASSWORD combination not found.'));

        return done(null, user);
      });
    });
  }));

  passport.use('local-signup', new LocalStrategy({

    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,

  }, (req, email, password, done) => {
    process.nextTick(() => {
      email = email.toLowerCase();

      User.findOne({
        'local.email': email
      }, (err, user) => {
        if (err)
          return done(err);

        if (user) {
          return done(null, false, req.flash('signupMessage', 'Email is already taken.'));
        } else {

          User.findOne({
            'local.displayNameLower': req.body.name.toLowerCase()
          }, (err, user) => {
            if (err)
              return done(err);

            if (user) {
              return done(null, false, req.flash('signupMessage', 'Display Name is already taken.'));
            } else if (password !== req.body['re-password']) {
              return done(null, false, req.flash('signupMessage', 'Passwords do not match.'));
            } else {

              const newUser = new User();

              newUser.loginAuth = 'local'

              newUser.local.email = email
              newUser.local.password = newUser.generateHash(password);
              newUser.local.displayName = req.body.name;
              newUser.local.displayNameLower = req.body.name.toLowerCase();
              newUser.local.id = '' + new Date().getTime() + email.charCodeAt(0);

              newUser.nbrClicks.clicks = 0;

              newUser.save(err => {
                if (err) throw err;

                console.log('newUser: ', newUser);
                return done(null, newUser);
              });
            }

          });
        }

      });
    });
  }));

};