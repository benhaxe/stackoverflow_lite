import {
  after, beforeEach, describe, before, it,
} from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { app, server } from '../../app';
import { UserModel } from '../../app/models/index';

const { expect } = chai;
chai.use(chaiHttp);

after(() => {
  server.close();
});

beforeEach((done) => {
  setTimeout(() => done(), 500);
});

describe('/auth/signup', () => {
  before((done) => {
    UserModel.delete()
      .then(() => {
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it('should reply with 200 status code', (done) => {
    chai
      .request(app)
      .post('/auth/signup')
      .type('form')
      .send({ email: 'easyclick05@gmail.com', password: 'abcdefgh' })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equals(200);
        expect(res.body).to.have.property('session').to.be.a('string');
        return done();
      });
  });

  it('should reply with 400 status code', (done) => {
    chai
      .request(app)
      .post('/auth/signup')
      .type('form')
      .send({ email: 'easyclick05@gmail.com', password: 'abcdefgh' })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equals(400);
        expect(res.body)
          .to.have.property('error')
          .to.equal('User already exists');
        return done();
      });
  });
});

describe('/auth/signup with invalid data', () => {
  beforeEach((done) => {
    UserModel.delete()
      .then(() => {
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it('should reply with invalid email error message', (done) => {
    chai
      .request(app)
      .post('/auth/signup')
      .type('form')
      .send({ email: 'easyclick@gmail', password: '62337087' })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body)
          .to.have.property('error')
          .to.equals('Invalid email');
        expect(res.status).to.equals(400);
        return done();
      });
  });
  it('should reply with 400 status code', (done) => {
    chai
      .request(app)
      .post('/auth/signup')
      .type('form')
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equals(400);
        return done();
      });
  });
  it('should reply with Missing credentials error message', (done) => {
    chai
      .request(app)
      .post('/auth/signup')
      .type('form')
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
