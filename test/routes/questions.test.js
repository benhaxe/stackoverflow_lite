import {
  after, beforeEach, describe, before, it,
} from 'mocha';
import request from 'supertest';
import { app } from '../../app';

import {
  UserModel, QuestionModel,
} from '../../app/models';


describe('DELETE /questions/:questionId', () => {
  let session;
  let id;
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
        ({ session } = res.body);
        return done();
      });
  });
  beforeEach((done) => {
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
        ({ id } = res.body);
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
      .delete(`/questions/${id}`)
      .set({
        Authorization: `Bearer ${session}`,
      })
      .expect(200, done);
  });
  it('should reply with 401 status code when authorization header is not set', (done) => {
    request(app)
      .delete(`/questions/${id}`)
      .set({})
      .expect(401, done);
  });
  it('should reply with 200 if given invalid data', (done) => {
    request(app)
      .delete('/questions/0')
      .set({
        Authorization: `Bearer ${session}`,
      })
      .expect(200, done);
  });
});
