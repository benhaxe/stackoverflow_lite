import { Router } from 'express';
import passport from 'passport';
import { QuestionModel, AnswerModel, CommentModel } from '../models/index';

const router = Router();
module.exports = (app) => {
  app.use('/questions',
  // Protect our route with jwt
    passport.authenticate('jwt', {
      session: false,
    }),
    router);
};
/*
    route for posting answer to a specfic function
*/
router.post('/:questionId/answers', async (req, res, next) => {
  let result;
  const { questionId } = req.params;
  const { answer } = req.body;
  const { id: userid } = req.user;
  if (!questionId || !answer) {
    return res.status(400).send('Answer cannot be null');
  }

  try {
    result = await AnswerModel.create({ answer, userid, questionId });
  } catch (err) {
    return next(err);
  }

  return res.json(result);
});

/*
   route for asking a question
 */
router.post('/', async (req, res, next) => {
  let result;
  const { question } = req.body;
  const { id: userid } = req.user;
  if (!question) {
    return res.status(400).send('Question cannot be null');
  }


  try {
    result = await QuestionModel.create({ question, userid });
  } catch (err) {
    return next(err);
  }

  return res.json(result);
});
