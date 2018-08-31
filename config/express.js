import express from 'express';
import glob from 'glob';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import compress from 'compression';
import methodOverride from 'method-override';
import cors from 'cors';
import passport from 'passport';
import flash from 'express-flash';
import dotenv from 'dotenv';
import session from 'express-session';
import db from './db/psql';


module.exports = (app) => {
  // dotenv configuration fro setting the environment variable
  dotenv.config();
  // start db
  db.connect().then(() => console.log('database connected'))
    .catch(err => console.log('unable to connect with dadatabase:', err));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: true,
    }),
  );
  app.use(cookieParser());
  app.use(compress());
  app.use(express.static(`${__dirname}../public`));
  app.use(methodOverride());
  app.use(
    cors({
      origin: 'http://localhost:3001',
    }),
  );
  app.use(
    session({
      secret: 'secret',
      saveUninitialized: false,
      resave: true,
    }),
  );
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  const passportConfigFiles = glob.sync(`${__dirname}/passport/*.js`);
  passportConfigFiles.forEach((passportConfigFile) => {
    require(passportConfigFile);
  });
  const controllers = glob.sync(`${__dirname}/../app/controllers/*.js`);
  controllers.forEach((controller) => {
    require(controller)(app);
  });

  app.use((req, res) => {
    const err = new Error('Not Found');
    err.status = 404;
    res.status(404).send(err);
  });

  if (app.get('env') === 'development') {
    app.use((err, req, res) => {
      res.status(err.status || 500);
      res.send({ error: 'Server error' });
      console.log(err);
    });
  }
  return app;
};
