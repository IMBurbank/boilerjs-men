'use strict';

const configAuth = require('./auth'),
      GitHubStrategy = require('passport-github').Strategy,
      GoogleStrategy = require('passport-google-oauth20').Strategy,
      User = require('../models/user');


module.exports = passport => {

  passport.serializeUser( (user, done) => { done(null, user.id); } );

  passport.deserializeUser( (id, done) => {
    User.findById(id, (err, user) => { done(err, user); } );
  });

  passport.use('github', new GitHubStrategy({

    clientID: configAuth.githubAuth.clientID,
    clientSecret: configAuth.githubAuth.clientSecret,
    callbackURL: configAuth.githubAuth.callbackURL

  }, (accessToken, refreshToken, profile, done) => {
    process.nextTick( () => {
      User.findOne({ 'github.id': profile.id }, (err, user) => {
        if (err) return done(err);

        if (user) return done(null, user);
        else {
          const newUser = new User();

          newUser.github.id = profile.id;
          newUser.github.username = profile.username;
          newUser.github.displayName = profile.displayName;
          newUser.github.publicRepos = profile._json.public_repos;

          newUser.userInfo.id = profile.id;
          newUser.userInfo.displayName = profile.displayName;
          newUser.userInfo.loginAuth = 'github';

          newUser.nbrClicks.clicks = 0;

          newUser.save( err => {
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
    process.nextTick( () => {
      User.findOne({ 'userInfo.id': profile.id }, function (err, user) {
        if (err) return done(err);

        if (user) return done(null, user);
        else {
          const newUser = new User();

          newUser.google.id = profile.id;
          newUser.google.displayName = profile.displayName;

          newUser.userInfo.id = profile.id;
          newUser.userInfo.displayName = profile.displayName;
          newUser.userInfo.loginAuth = 'google';

          newUser.nbrClicks.clicks = 0;

          newUser.save( err => {
            if (err) throw err;

            return done(null, newUser);
          });

        }
      });
    });
  }));

};

/*    Google user Object

GOOGLE PROFILE:  { id: '110431470555639614622',
  displayName: 'Isaac B',
  name: { familyName: 'B', givenName: 'Isaac' },
  photos: [ { value: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50' } ],
  gender: 'male',
  provider: 'google',
  _raw: '{\n "kind": "plus#person",\n "etag": "\\"Sh4n9u6EtD24TM0RmWv7jTXojqc/wk2-mAYuPitAzYoBFCD6tfWC5P4\\"",\n "gender": "male",\n "objectType": "person",\n "id": "110431470555639614622",\n "displ
ayName": "Isaac B",\n "name": {\n  "familyName": "B",\n  "givenName": "Isaac"\n },\n "url": "https://plus.google.com/110431470555639614622",\n "image": {\n  "url": "https://lh3.googleusercontent.com
/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50",\n  "isDefault": true\n },\n "isPlusUser": true,\n "language": "en",\n "circledByCount": 6,\n "verified": false\n}\n',
  _json:
   { kind: 'plus#person',
     etag: '"Sh4n9u6EtD24TM0RmWv7jTXojqc/wk2-mAYuPitAzYoBFCD6tfWC5P4"',
     gender: 'male',
     objectType: 'person',
     id: '110431470555639614622',
     displayName: 'Isaac B',
     name: { familyName: 'B', givenName: 'Isaac' },
     url: 'https://plus.google.com/110431470555639614622',
     image:
      { url: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50',
        isDefault: true },
     isPlusUser: true,
     language: 'en',
     circledByCount: 6,
     verified: false } }

*/
