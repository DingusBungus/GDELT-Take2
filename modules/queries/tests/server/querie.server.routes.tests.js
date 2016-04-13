'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  query = mongoose.model('query'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, query;

/**
 * query routes tests
 */
describe('query CRUD tests', function () {

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

    // Save a user to the test db and create new query
    user.save(function () {
      query = {
        title: 'query Title',
        content: 'query Content'
      };

      done();
    });
  });

  it('should be able to save an query if logged in', function (done) {
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

        // Save a new query
        agent.post('/api/queries')
          .send(query)
          .expect(200)
          .end(function (querieSaveErr, querieSaveRes) {
            // Handle query save error
            if (querieSaveErr) {
              return done(querieSaveErr);
            }

            // Get a list of queries
            agent.get('/api/queries')
              .end(function (queriesGetErr, queriesGetRes) {
                // Handle query save error
                if (queriesGetErr) {
                  return done(queriesGetErr);
                }

                // Get queries list
                var queries = queriesGetRes.body;

                // Set assertions
                (queries[0].user._id).should.equal(userId);
                (queries[0].title).should.match('query Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an query if not logged in', function (done) {
    agent.post('/api/queries')
      .send(query)
      .expect(403)
      .end(function (querieSaveErr, querieSaveRes) {
        // Call the assertion callback
        done(querieSaveErr);
      });
  });

  it('should not be able to save an query if no title is provided', function (done) {
    // Invalidate title field
    query.title = '';

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

        // Save a new query
        agent.post('/api/queries')
          .send(query)
          .expect(400)
          .end(function (querieSaveErr, querieSaveRes) {
            // Set message assertion
            (querieSaveRes.body.message).should.match('Title cannot be blank');

            // Handle query save error
            done(querieSaveErr);
          });
      });
  });

  it('should be able to update an query if signed in', function (done) {
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

        // Save a new query
        agent.post('/api/queries')
          .send(query)
          .expect(200)
          .end(function (querieSaveErr, querieSaveRes) {
            // Handle query save error
            if (querieSaveErr) {
              return done(querieSaveErr);
            }

            // Update query title
            query.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing query
            agent.put('/api/queries/' + querieSaveRes.body._id)
              .send(query)
              .expect(200)
              .end(function (querieUpdateErr, querieUpdateRes) {
                // Handle query update error
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
    // Create new query model instance
    var querieObj = new query(query);

    // Save the query
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

  it('should be able to get a single query if not signed in', function (done) {
    // Create new query model instance
    var querieObj = new query(query);

    // Save the query
    querieObj.save(function () {
      request(app).get('/api/queries/' + querieObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', query.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single query with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/queries/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'query is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single query which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent query
    request(app).get('/api/queries/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No query with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an query if signed in', function (done) {
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

        // Save a new query
        agent.post('/api/queries')
          .send(query)
          .expect(200)
          .end(function (querieSaveErr, querieSaveRes) {
            // Handle query save error
            if (querieSaveErr) {
              return done(querieSaveErr);
            }

            // Delete an existing query
            agent.delete('/api/queries/' + querieSaveRes.body._id)
              .send(query)
              .expect(200)
              .end(function (querieDeleteErr, querieDeleteRes) {
                // Handle query error error
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

  it('should not be able to delete an query if not signed in', function (done) {
    // Set query user
    query.user = user;

    // Create new query model instance
    var querieObj = new query(query);

    // Save the query
    querieObj.save(function () {
      // Try deleting query
      request(app).delete('/api/queries/' + querieObj._id)
        .expect(403)
        .end(function (querieDeleteErr, querieDeleteRes) {
          // Set message assertion
          (querieDeleteRes.body.message).should.match('User is not authorized');

          // Handle query error error
          done(querieDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      query.remove().exec(done);
    });
  });
});
