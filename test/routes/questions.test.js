import {
  after, describe, before, it,
} from 'mocha';
import request from 'supertest';

import { app } from '../../app';

import {
  UserModel, QuestionModel, AnswerModel, CommentModel,
} from '../../app/models';


describe('POST /questions/:questionId/answers/:answerId/comments', () => {
  let session;
  let questionId;
  let answerId;
  before((done) => {
    request(app)
      .post('/auth/signup')
      .type('form')
      .set({
        'Content-Type': 'application/x-www-form-urlencoded',
      })
      .send({
        email: 'easyclick05@gmail.com',
        password: '12345678',
      })
      .expect(200, done);
  });
  before((done) => {
    request(app)
      .post('/auth/login')
      .type('form')
      .set({
        'Content-Type': 'application/x-www-form-urlencoded',
      })
      .send({
        email: 'easyclick05@gmail.com',
        password: '12345678',
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        ({
          session,
        } = res.body);
        return done();
      });
  });
  before((done) => {
    request(app)
      .post('/questions')
      .type('form')
      .set({
        Authorization: `Bearer ${session}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      })
      .send({
        question: 'hello habibi?',
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        ({
          id: questionId,
        } = res.body);
        return done();
      });
  });

  before((done) => {
    request(app)
      .post(`/questions/${questionId}/answers`)
      .type('form')
      .set({
        Authorization: `Bearer ${session}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      })
      .send({
        answer: 'no',
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        ({
          id: answerId,
        } = res.body);
        return done();
      });
  });

  after((done) => {
    UserModel.delete()
      .then(() => {
        done();
      })
      .catch((e) => {
        done(e);
      });
  });
  after((done) => {
    QuestionModel.delete()
      .then(() => {
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  after((done) => {
    AnswerModel.delete()
      .then(() => {
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  after((done) => {
    CommentModel.delete()
      .then(() => {
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it('should reply with 200 status code for comment posted', (done) => {
    request(app)
      .post(`/questions/${questionId}/answers/${answerId}/comments`)
      .set({
        Authorization: `Bearer ${session}`,
      })
      .type('form')
      .send({
        comment: 'You are a liar fam',
      })
      .expect(200, done);
  });
  it('should reply with 401 status code when authorization header is not set', (done) => {
    request(app)
      .post(`/questions/${questionId}/answers/${answerId}/comments`)
      .set({})
      .type('form')
      .send({
        author: true,
      })
      .expect(401, done);
  });
});
