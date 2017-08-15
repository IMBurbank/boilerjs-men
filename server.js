'use strict';


const express = require('express'),
      mongoose = require('mongoose'),
      passport = require('passport'),
      routes = require('./app/routes/index.js'),
      session = require('express-session');


require('dotenv').load();
require('./app/config/passport')(passport);


const app = express(),
      appPort = process.env.APP_PORT || 3000,
      dir = process.cwd(),
      nodeEnv = process.env.NODE_ENV;


mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI, { useMongoClient: true });


app.use('/common', express.static(dir + '/app/common'))
app.use('/controllers', express.static(dir + '/app/controllers'));
app.use('/public', express.static(dir + '/public'));

app.use(session({
  secret: 'boilerSecret',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

routes(app, passport);

app.listen(appPort, () => {
  console.log(`Express App listening on port ${appPort}...`);
});


/*
const startServer = async function _startServer() {
  try {
    const db = await MongoClient.connect('mongodb://localhost:27017/' + dbName);

    app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
    app.use('/public', express.static(process.cwd() + '/public'));

    routes(app, db, collectionName);

    const listener = await app.listen(appPort);
    console.log('MongoDB connectedto port, db: ', db.serverConfig.s.port, db.databaseName);
    console.log('Express listening on port ', listener.address().port);
  }
  catch(err) { throw err }
};

if (nodeEnv !== 'test') startServer();

module.exports = { app, collectionName, MongoClient, routes };
*/
