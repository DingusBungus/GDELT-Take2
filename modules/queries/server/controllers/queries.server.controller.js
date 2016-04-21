'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Query = mongoose.model('Query'),
  actor = mongoose.model('actor'),
  eventX = mongoose.model('event'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
var gcloud = require('gcloud')({
  projectId: 'gdelt-pre'
});

/*-------------------------------------------------------------------*/
// Copyright 2016, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// [START complete]

// [START auth]
// You must set the GOOGLE_APPLICATION_CREDENTIALS and GCLOUD_PROJECT
// environment variables to run this sample

// Get a reference to the bigquery component
var bigquery = gcloud.bigquery();

function printExample(rows) {
  rows.forEach(function (row) {
    var str = '';
    for (var key in row) {
      if (str) {
        str += '\t';
      }
      str += key + ': ' + row[key];
    }
    console.log(str);
  });
}

function doCreate(query, res) {
  
  query.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(query);
    }
  });
}
/*-------------------------------------------------------------------*/

/**
 * Create a query
 */
exports.create = function (req, res) { 

  var queryBody = new Query(req.body);
  
  var query = queryBody.built_query;
  //console.log(query);
  bigquery.query(query, function(err, rows) {
    if (err) {
      return res.status(404).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    queryBody.query_results = rows;
    doCreate(queryBody, res);
  });
};

/**
 * Show the current query
 */
exports.read = function (req, res) {
  res.json(req.query);
};

/**
 * Show the current actor
 */
exports.readActor = function (req, res) {
  res.json(req.actor);
};

/**
 * Show the current event
 */
exports.readEvent = function (req, res) {
  res.json(req.event);
};

/**
 * Update a query
 */
exports.update = function (req, res) {
  var query = req.query;

  query.title = req.body.title;
  query.content = req.body.content;

  query.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(query);
    }
  });
};

/**
 * Delete an query
 */
exports.delete = function (req, res) {
  var query = req.query;

  query.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(query);
    }
  });
};

/**
 * List of Queries
 */
exports.list = function (req, res) {
  Query.find().sort('-created').populate('user', 'displayName').exec(function (err, queries) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(queries);
    }
  });
};

/**
 * List of Actors
 */
exports.listActors = function (req, res) {
  actor.find().sort('name').exec(function (err, actors) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(actors);
    }
  });
};

/**
 * List of Events
 */
exports.listEvents = function (req, res) {
  eventX.find().sort('name').exec(function (err, events) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(events);
    }
  });
};

/**
 * query middleware
 */
exports.queryByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'query is invalid'
    });
  }

  Query.findById(id).populate('user', 'displayName').exec(function (err, query) {
    if (err) {
      return next(err);
    } else if (!query) {
      return res.status(404).send({
        message: 'No query with that identifier has been found'
      });
    }
    req.query = query;
    next();
  });
};

/**
 * query middleware
 */
exports.actorByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'actor is invalid'
    });
  }

  actor.findById(id).exec(function (err, actor) {
    if (err) {
      return next(err);
    } else if (!actor) {
      return res.status(404).send({
        message: 'No actor with that identifier has been found'
      });
    }
    req.actor = actor;
    next();
  });
};

/**
 * query middleware
 */
exports.eventByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'event is invalid'
    });
  }

  eventX.findById(id).exec(function (err, event) {
    if (err) {
      return next(err);
    } else if (!event) {
      return res.status(404).send({
        message: 'No event with that identifier has been found'
      });
    }
    req.event = event;
    next();
  });
};



