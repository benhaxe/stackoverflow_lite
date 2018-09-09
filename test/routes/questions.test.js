import {
  after,
  beforeEach,
  describe,
  before,
  it,
} from 'mocha';
import request from 'supertest';
import chai from 'chai';

import {
  app,
} from '../../app';

import {
  UserModel,
  QuestionModel,
} from '../../app/models';


describe('POST /questions/v1/:questionId/answers', () => {
  let session;
  let id;
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
          id,
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

  it('should reply with 200 status code', (done) => {
    request(app)
      .post(`/questions/v1/${id}/answers`)
      .set({
        Authorization: `Bearer ${session}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      })
      .type('form')
      .send({
        answer: 'yes',
      })
      .expect(200, done);
  });
  it('should reply with 401 status code when authorization header is not set', (done) => {
    request(app)
      .post(`/questions/v1/${id}/answers`)
      .set({
        'Content-Type': 'application/x-www-form-urlencoded',
      })
      .type('form')
      .send({
        answer: 'yes',
      })
      .expect(401, done);
  });

  it('should reply with 401 status code when answer is not provided', (done) => {
    request(app)
      .post(`/questions/v1/${id}/answers`)
      .set({
        'Content-Type': 'application/x-www-form-urlencoded',
      })
      .type('form')
      .send()
      .expect(401, done);
  });
});
