'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  query = mongoose.model('query'),
  actor = mongoose.model('actor'),
  event = mongoose.model('event'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a query
 */
exports.create = function (req, res) {
  var query = new query(req.body);
  query.user = req.user;

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
  query.find().sort('-created').populate('user', 'displayName').exec(function (err, queries) {
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
  event.find().sort('name').exec(function (err, events) {
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

  query.findById(id).populate('user', 'displayName').exec(function (err, query) {
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

  event.findById(id).exec(function (err, event) {
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



