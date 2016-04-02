'use strict';

/**
 * Module dependencies.
 */
var queriesPolicy = require('../policies/queries.server.policy'),
  queries = require('../controllers/queries.server.controller');

module.exports = function (app) {
  // Queries collection routes
  app.route('/api/queries').all(queriesPolicy.isAllowed)
    .get(queries.list)
    .post(queries.create);

  // Single querie routes
  app.route('/api/queries/:querieId').all(queriesPolicy.isAllowed)
    .get(queries.read)
    .put(queries.update)
    .delete(queries.delete);

  // Finish by binding the querie middleware
  app.param('querieId', queries.querieByID);
};
