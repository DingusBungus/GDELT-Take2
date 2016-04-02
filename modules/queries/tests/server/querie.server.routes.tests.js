'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Querie = mongoose.model('Querie'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, querie;

/**
 * Querie routes tests
 */
describe('Querie CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new querie
    user.save(function () {
      querie = {
        title: 'Querie Title',
        content: 'Querie Content'
      };

      done();
    });
  });

  it('should be able to save an querie if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new querie
        agent.post('/api/queries')
          .send(querie)
          .expect(200)
          .end(function (querieSaveErr, querieSaveRes) {
            // Handle querie save error
            if (querieSaveErr) {
              return done(querieSaveErr);
            }

            // Get a list of queries
            agent.get('/api/queries')
              .end(function (queriesGetErr, queriesGetRes) {
                // Handle querie save error
                if (queriesGetErr) {
                  return done(queriesGetErr);
                }

                // Get queries list
                var queries = queriesGetRes.body;

                // Set assertions
                (queries[0].user._id).should.equal(userId);
                (queries[0].title).should.match('Querie Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an querie if not logged in', function (done) {
    agent.post('/api/queries')
      .send(querie)
      .expect(403)
      .end(function (querieSaveErr, querieSaveRes) {
        // Call the assertion callback
        done(querieSaveErr);
      });
  });

  it('should not be able to save an querie if no title is provided', function (done) {
    // Invalidate title field
    querie.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new querie
        agent.post('/api/queries')
          .send(querie)
          .expect(400)
          .end(function (querieSaveErr, querieSaveRes) {
            // Set message assertion
            (querieSaveRes.body.message).should.match('Title cannot be blank');

            // Handle querie save error
            done(querieSaveErr);
          });
      });
  });

  it('should be able to update an querie if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new querie
        agent.post('/api/queries')
          .send(querie)
          .expect(200)
          .end(function (querieSaveErr, querieSaveRes) {
            // Handle querie save error
            if (querieSaveErr) {
              return done(querieSaveErr);
            }

            // Update querie title
            querie.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing querie
            agent.put('/api/queries/' + querieSaveRes.body._id)
              .send(querie)
              .expect(200)
              .end(function (querieUpdateErr, querieUpdateRes) {
                // Handle querie update error
                if (querieUpdateErr) {
                  return done(querieUpdateErr);
                }

                // Set assertions
                (querieUpdateRes.body._id).should.equal(querieSaveRes.body._id);
                (querieUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of queries if not signed in', function (done) {
    // Create new querie model instance
    var querieObj = new Querie(querie);

    // Save the querie
    querieObj.save(function () {
      // Request queries
      request(app).get('/api/queries')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single querie if not signed in', function (done) {
    // Create new querie model instance
    var querieObj = new Querie(querie);

    // Save the querie
    querieObj.save(function () {
      request(app).get('/api/queries/' + querieObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', querie.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single querie with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/queries/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Querie is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single querie which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent querie
    request(app).get('/api/queries/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No querie with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an querie if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new querie
        agent.post('/api/queries')
          .send(querie)
          .expect(200)
          .end(function (querieSaveErr, querieSaveRes) {
            // Handle querie save error
            if (querieSaveErr) {
              return done(querieSaveErr);
            }

            // Delete an existing querie
            agent.delete('/api/queries/' + querieSaveRes.body._id)
              .send(querie)
              .expect(200)
              .end(function (querieDeleteErr, querieDeleteRes) {
                // Handle querie error error
                if (querieDeleteErr) {
                  return done(querieDeleteErr);
                }

                // Set assertions
                (querieDeleteRes.body._id).should.equal(querieSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an querie if not signed in', function (done) {
    // Set querie user
    querie.user = user;

    // Create new querie model instance
    var querieObj = new Querie(querie);

    // Save the querie
    querieObj.save(function () {
      // Try deleting querie
      request(app).delete('/api/queries/' + querieObj._id)
        .expect(403)
        .end(function (querieDeleteErr, querieDeleteRes) {
          // Set message assertion
          (querieDeleteRes.body.message).should.match('User is not authorized');

          // Handle querie error error
          done(querieDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Querie.remove().exec(done);
    });
  });
});
