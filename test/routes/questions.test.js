import {
  after, describe, before, it,
} from 'mocha';
import request from 'supertest';
import chai from 'chai';

import { app } from '../../app';

import {
  UserModel, QuestionModel,
} from '../../app/models';

const { expect } = chai;

describe('POST /questions', () => {
  let session;
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
      .post('/questions')
      .set({
        Authorization: `Bearer ${session}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      })
      .type('form')
      .send({ question: 'how are you' })
      .expect(200, done);
  });
  it('should reply with 401 status code', (done) => {
    request(app)
      .post('/questions')
      .set({
        'Content-Type': 'application/x-www-form-urlencoded',
      })
      .type('form')
      .send({
        question: 'how are you',
      })
      .expect(401, done);
  });
  it('should reply with 400 status code when no question is passed to it', (done) => {
    request(app)
      .post('/questions')
      .set({
        Authorization: `Bearer ${session}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      })
      .type('form')
      .send({})
      .expect(400, done);
  });
});
