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

/*
    route for deleting a question from the database
*/
router.delete('/:questionId', async (req, res, next) => {
  const { questionId } = req.params;
  if (!questionId) {
    return res.status(400).send('Question id cannot be null');
  }

  try {
    await QuestionModel.deleteOne({ where: { id: questionId } });
  } catch (err) {
    return next(err);
  }
  return res.status(200).send('deleted');
});
