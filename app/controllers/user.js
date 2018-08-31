import express from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';

const { SECRET } = process.env;
const router = express.Router();

module.exports = (app) => {
  app.use('/auth', router);
};
/*
 This route is used for signing up for our app
 */
router.post('/signup', (req, res, next) => {
  passport.authenticate('user-register', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (user) {
      const payload = { email: user.email, id: user.id };
      const token = jwt.sign(payload, SECRET);
      return res.json({ session: token }); // return token to the client
    }
    return res.status(400).send({ error: info.message });
  })(req, res, next);
});

/*
    This route is for handling user login
 */
router.post('/login', (req, res, next) => {
  passport.authenticate('user-login', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (user) {
      const payload = { email: user.email, id: user.id };
      const token = jwt.sign(payload, SECRET);
      return res.json({ session: token });
    }
    return res.status(400).send({ error: info.message });
  })(req, res, next);
});
