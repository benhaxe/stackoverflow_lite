import {
  after,
  describe,
  before,
  it,
} from 'mocha';
import request from 'supertest';

import {
  app,
} from '../../app';

import {
  UserModel,
  QuestionModel,
  AnswerModel,
} from '../../app/models';


describe('PUT /questions/v1/:questionId/answers/answerId', () => {
  let session;
  let questionId;
  let answerId;
  before((done) => {
    request(app)
      .post('/auth/v1/signup')
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
      .post('/auth/v1/login')
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
      .post('/questions/v1')
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
      .post(`/questions/v1/${questionId}/answers`)
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

  it('should reply with 200 status code', (done) => {
    request(app)
      .put(`/questions/v1/${questionId}/answers/${answerId}`)
      .set({
        Authorization: `Bearer ${session}`,
      })
      .type('form')
      .send({
        author: true,
      })
      .expect(200, done);
  });
  it('should reply with 401 status code when authorization header is not set', (done) => {
    request(app)
      .put(`/questions/v1/${questionId}/answers/${answerId}`)
      .set({})
      .type('form')
      .send({
        author: true,
      })
      .expect(401, done);
  });
  it('should reply with 200 for upvote', (done) => {
    request(app)
      .put(`/questions/v1/${questionId}/answers/${answerId}`)
      .set({
        Authorization: `Bearer ${session}`,
      })
      .type('form')
      .send({
        upvote: 0,
      })
      .expect(200, done);
  });

  it('should reply with 200 for downvote', (done) => {
    request(app)
      .put(`/questions/v1/${questionId}/answers/${answerId}`)
      .set({
        Authorization: `Bearer ${session}`,
      })
      .type('form')
      .send({
        downvote: 0,
      })
      .expect(200, done);
  });
  it('should reply with 200 for update to answer', (done) => {
    request(app)
      .put(`/questions/v1/${questionId}/answers/${answerId}`)
      .set({
        Authorization: `Bearer ${session}`,
      })
      .type('form')
      .send()
      .expect(200, done);
  });
});
