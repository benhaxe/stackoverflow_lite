import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import bcrypt from 'bcrypt';
import { isEmail } from 'validator';
import { UserModel } from '../../app/models/index';

const { SECRET } = process.env;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = SECRET;


passport.use(new JwtStrategy(opts, async (payload, done) => {
  let user;
  try {
    user = await UserModel.findOne({ where: { email: payload.email } });
  } catch (err) {
    return done(err);
  }
  if (user) {
    return done(null, user);
  }
  return done(null, false, { message: 'Unauthorized Acesss' });
}));

passport.use(
  'user-login',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (reqEmail, password, done) => {
      const email = reqEmail.toLowerCase();
      if (!isEmail(email)) {
        return done(null, false, { message: 'Invalid email' });
      }
      let user;
      try {
        user = await UserModel.findOne({ where: { email } });
      } catch (e) {
        return done(e);
      }

      if (!user) {
        return done(null, false, {
          message: 'User does not exist',
        });
      }
      let stat;
      try {
        stat = await bcrypt.compare(password, user.password);
      } catch (err) {
        return console.log(err);
      }

      if (stat) {
        return done(null, user, {
          message: 'Successful login',
        });
      }
      return done(null, false, {
        message: 'Invalid Password',
      });
    },
  ),
);

passport.use(
  'user-register',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (reqEmail, password, done) => {
      const email = reqEmail.toLowerCase();

      if (!isEmail(email)) {
        return done(null, false, { message: 'Invalid email' });
      }
      let user;
      try {
        user = await UserModel.findOne({ where: { email } });
      } catch (err) {
        return done(err);
      }
      if (user) {
        return done(null, false, { message: 'User already exists' });
      }
      if (!user) {
        let newUser;
        let encryptedPassword;
        try {
          encryptedPassword = await bcrypt.hash(password, 10);
          newUser = await UserModel.create({ email, password: encryptedPassword });
        } catch (e) {
          return done(e);
        }
        return done(null, newUser, { message: 'User created successfully' });
      }
    },
  ),
);
