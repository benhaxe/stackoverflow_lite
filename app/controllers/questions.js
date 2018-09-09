import {
  Router
} from 'express';
import passport from 'passport';
import {
  QuestionModel
} from '../models/index';

const router = Router();
module.exports = (app) => {
  app.use('/questions/v1',
    // Protect our route with jwt
    passport.authenticate('jwt', {
      session: false,
    }),
    router);
};
/*
   route for asking a question
 */
router.post('/', async (req, res, next) => {
  let result;
  const {
    question,
  } = req.body;
  const {
    id: userid,
  } = req.user;
  if (!question) {
    return res.status(400).send('Question cannot be null');
  }


  try {
    result = await QuestionModel.create({
      question,
      userid,
    });
  } catch (err) {
    return next(err);
  }

  return res.json(result);
});

router.get('/', async (req, res, next) => {
  let questions;
  try {
    questions = await QuestionModel.find({});
  } catch (err) {
    next(err);
  }
  return res.json(questions);
});
