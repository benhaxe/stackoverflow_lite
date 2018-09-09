import {
  after,
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

const {
  expect,
} = chai;


describe('GET /questions/v1/:questionId', () => {
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
      .get(`/questions/v1/${id}`)
      .set({
        Authorization: `Bearer ${session}`,
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(200);
        return done();
      });
  });
  it('should reply with 401 status code when auth/v1orization header is not set', (done) => {
    request(app)
      .get(`/questions/v1/${id}`)
      .set({})
      .expect(401, done);
  });

  it('should return empty questions/v1 with answers array', (done) => {
    request(app)
      .get(`/questions/v1/${id}`)
      .set('Authorization', `Bearer ${session}`)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body).to.be.an('array');
        done();
      });
  });
});
