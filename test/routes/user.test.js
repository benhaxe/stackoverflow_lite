import {
  after,
  beforeEach,
  describe,
  before,
  it,
} from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import {
  app,
  server,
} from '../../app';
import {
  UserModel,
} from '../../app/models/index';

const {
  expect,
} = chai;
chai.use(chaiHttp);

after(() => {
  server.close();
});

beforeEach((done) => {
  setTimeout(() => done(), 500);
});

describe('/auth/v1/login/', () => {
  before((done) => {
    chai
      .request(app)
      .post('/auth/v1/signup')
      .type('form')
      .send({
        email: 'easyclick05@gmail.com',
        password: 'abcdefgh',
      })
      .then(() => done())
      .catch((err) => {
        done(err);
      });
  });
  after((done) => {
    UserModel.delete()
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should reply with 200 status code', (done) => {
    chai
      .request(app)
      .post('/auth/v1/login')
      .type('form')
      .send({
        email: 'easyclick05@gmail.com',
        password: 'abcdefgh',
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equals(200);
        return done();
      });
  });

  it('should have a response body with property session', (done) => {
    chai
      .request(app)
      .post('/auth/v1/login')
      .type('form')
      .send({
        email: 'easyclick05@gmail.com',
        password: 'abcdefgh',
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body)
          .to.have.property('session')
          .to.be.a('string');
        return done();
      });
  });
  it('should have a response status code of 200', (done) => {
    chai
      .request(app)
      .post('/auth/v1/login')
      .type('form')
      .send({
        email: 'easyclick05@gmail.com',
        password: 'abcdefgh',
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(200);
        return done();
      });
  });
  it('should have a response status code of 400', (done) => {
    chai
      .request(app)
      .post('/auth/v1/login')
      .type('form')
      .send({
        email: 'easyclick0@gmail.com',
        password: 'abcdefgh',
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equal(400);
        return done();
      });
  });
  it('should have an error response "User does not exist"', (done) => {
    chai
      .request(app)
      .post('/auth/v1/login')
      .type('form')
      .send({
        email: 'easyclick0@gmail.com',
        password: 'abcdefgh',
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body)
          .to.have.property('error')
          .to.equals('User does not exist');
        return done();
      });
  });
  it('should have an error response "Invalid password"', (done) => {
    chai
      .request(app)
      .post('/auth/v1/login')
      .type('form')
      .send({
        email: 'easyclick05@gmail.com',
        password: 'abcde',
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body)
          .to.have.property('error')
          .to.equals('Invalid Password');
        return done();
      });
  });
  it('should have an error response "Missing credentials"', (done) => {
    chai
      .request(app)
      .post('/auth/v1/login')
      .type('form')
      .send({
        email: 'easyclick05@gmail.com',
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body)
          .to.have.property('error')
          .to.equals('Missing credentials');
        return done();
      });
  });
});
