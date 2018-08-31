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
    route for getting a particular quetion and asnwers to the question
    from the database.
*/
router.get('/:questionId', async (req, res, next) => {
  let result;
  const { questionId } = req.params;
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
   route for getting all questions from the database
*/
router.get('/', async (req, res, next) => {
  let questions;
  try {
    questions = await QuestionModel.find({ where: {} });
  } catch (err) {
    next(err);
  }
  return res.json(questions);
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

/*
  This route perform many function
  1. It is use by the author of a question to accept an answer
  2. It is use by the  author of the answer to modify the answer posted earlier
  3. It is used by anybody to upvote and downvote an answer
 */
router.put('/:questionId/answers/:answerId', async (req, res, next) => {
  const { questionId, answerId } = req.params;
  const {
    answer, author, upvote, downvote,
  } = req.body;
  if (!questionId || !answerId) {
    return res.status(400).send('Question or user id cannot be null');
  }

  try {
    // Downvote Logic
    if (downvote) {
      await AnswerModel.update({
        id: answerId,
      }, {
        downvote: downvote + 1,
      });
      return res.status(200).send('downvoted');
    }
    // Upvote Logic
    if (upvote) {
      await AnswerModel.update({
        id: answerId,
      }, {
        upvote: upvote + 1,
      });
      return res.status(200).send('upvoted');
    }
    // Acceptance Logic
    if (author) {
      await AnswerModel.update({
        id: answerId,
      }, {
        accepted: true,
      });
      return res.status(200).send('accepted');
    }
    // Update logic
    await AnswerModel.update({
      id: answerId,
    }, {
      answer,
    });
    return res.status(200).send('updated');
  } catch (err) {
    return next(err);
  }
});
/*
this route is used for commenting on an answer by users
 */
router.post('/:questionId/answers/:answerId/comments', async (req, res, next) => {
  const { comment } = req.body;
  const { answerId: answerid } = req.params;
  const { id: userid } = req.user;
  let result;
  if (!comment) {
    return res.status(400).send('Comments cannot be empty');
  }
  try {
    result = await CommentModel.create({ comment, userid, answerid });
  } catch (err) {
    return next(err);
  }

  return res.json(result);
});
