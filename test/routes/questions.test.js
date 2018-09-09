import {
  after,
  describe,
  before,
  it,
} from 'mocha';
import request from 'supertest';
import chai from 'chai';

import {
  app
} from '../../app';

import {
  UserModel,
  QuestionModel,
} from '../../app/models';

const {
  expect
} = chai;

describe('GET /questions/v1', () => {
  let session;
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
        'Content-Type': 'application/x-www-form-urlencoded'
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
          session
        } = res.body);
        return done();
      });
  });
  before((done) => {
    QuestionModel.delete().then(() => done())
      .catch(err => done(err));
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

  it('should reply with 200 status code', (done) => {
    request(app)
      .get('/questions/v1')
      .set({
        Authorization: `Bearer ${session}`
      })
      .expect(200, done);
  });
  it('should reply with 401 status code when authorization header is not set', (done) => {
    request(app)
      .get('/questions/v1')
      .expect(401, done);
  });

  it('should reply with 401 status code when passed invalid session value', (done) => {
    request(app)
      .get('/questions/v1')
      .set({
        Authorization: 'Bearer sjjsggdg'
      })
      .expect(401, done);
  });
  it('should return empty questions/v1 array', (done) => {
    request(app)
      .get('/questions/v1')
      .set('Authorization', `Bearer ${session}`)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body)
          .to.be.an('array')
          .and.have.length(0);
        done();
      });
  });
});
describe('GET /questions/v1', () => {
  let session;
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
      .set({
        'Content-Type': 'application/x-www-form-urlencoded',
      })
      .type('form')
      .send({
        email: 'easyclick05@gmail.com',
        password: '12345678',
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        ({
          session
        } = res.body);
        return done();
      });
  });
  before((done) => {
    request(app)
      .post('/questions/v1')
      .set({
        Authorization: `Bearer ${session}`
      })
      .type('form')
      .send({
        question: 'How are you?'
      })
      .expect(200, done);
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

  it('should return array of quetions', (done) => {
    request(app)
      .get('/questions/v1')
      .set('Authorization', `Bearer ${session}`)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body)
          .to.be.an('array')
          .and.have.length.gte(1);
        done();
      });
  });
});
