import {
  Router,
} from 'express';
import passport from 'passport';
import {
  QuestionModel,
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
/*
    route for getting a particular quetion and asnwers to the question
    from the database.
*/
router.get('/:questionId', async (req, res, next) => {
  let result;
  const {
    questionId,
  } = req.params;
  if (!questionId) {
    return res.status(400).send('Question id cannot be null');
  }

  try {
    result = await QuestionModel.query(`select * from questions,answers where questions.id=${questionId} and answers.questionid=${questionId}`);
  } catch (err) {
    return next(err);
  }

  return res.json(result.rows);
});
