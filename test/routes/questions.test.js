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
  app
} from '../../app';

import {
  UserModel,
  QuestionModel,
  AnswerModel,
  CommentModel,
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
      .end((err, res) => {
        if (err) {
          conole.log('err:', err);
          return done(err)
        }
        expect(res.status).to.equals(200);
        done();
      })
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
          session,
          id
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
        question: 'How are you?',
        id
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

describe('POST /questions/v1', () => {
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
          session
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
      .post('/questions/v1')
      .set({
        Authorization: `Bearer ${session}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      })
      .type('form')
      .send({
        question: 'how are you'
      })
      .expect(200, done);
  });
  it('should reply with 400 status code when invalid is passed to it', (done) => {
    request(app)
      .post('/questions/v1')
      .set({
        Authorization: `Bearer ${session}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      })
      .type('form')
      .send({})
      .expect(400, done);
  });
});

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
          session
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
          id
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
      .expect(200, done);
  });
  it('should reply with 401 status code when authorization header is not set', (done) => {
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
          session
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
          id
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
        answer: 'yes'
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

describe('DELETE /questions/v1/:questionId', () => {
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
          session
        } = res.body);
        return done();
      });
  });
  beforeEach((done) => {
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
          id
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
      .delete(`/questions/v1/${id}`)
      .set({
        Authorization: `Bearer ${session}`,
      })
      .expect(200, done);
  });
  it('should reply with 401 status code when authorization header is not set', (done) => {
    request(app)
      .delete(`/questions/v1/${id}`)
      .set({})
      .expect(401, done);
  });
  it('should reply with 200 if given invalid ', (done) => {
    request(app)
      .delete('/questions/v1/0')
      .set({
        Authorization: `Bearer ${session}`,
      })
      .expect(200, done);
  });
});

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
          session
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
          id: questionId
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
          id: answerId
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
        author: true
      })
      .expect(200, done);
  });
  it('should reply with 401 status code when authorization header is not set', (done) => {
    request(app)
      .put(`/questions/v1/${questionId}/answers/${answerId}`)
      .set({})
      .type('form')
      .send({
        author: true
      })
      .expect(401, done);
  });
  it('should reply with 200 for upvote', (done) => {
    request(app)
      .put(`/questions/v1/${questionId}/answers/${answerId}`)
      .set({
        Authorization: `Bearer ${session}`
      })
      .type('form')
      .send({
        upvote: 0
      })
      .expect(200, done);
  });

  it('should reply with 200 for downvote', (done) => {
    request(app)
      .put(`/questions/v1/${questionId}/answers/${answerId}`)
      .set({
        Authorization: `Bearer ${session}`
      })
      .type('form')
      .send({
        downvote: 0
      })
      .expect(200, done);
  });
  it('should reply with 200 for update to answer', (done) => {
    request(app)
      .put(`/questions/v1/${questionId}/answers/${answerId}`)
      .set({
        Authorization: `Bearer ${session}`
      })
      .type('form')
      .send()
      .expect(200, done);
  });
});

describe('POST /questions/v1/:questionId/answers/:answerId/comments', () => {
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
      .post(`/questions/v1/${questionId}/answers/${answerId}/comments`)
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
      .post(`/questions/v1/${questionId}/answers/${answerId}/comments`)
      .set({})
      .type('form')
      .send({
        author: true,
      })
      .expect(401, done);
  });
});
