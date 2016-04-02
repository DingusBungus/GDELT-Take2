'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Querie = mongoose.model('Querie'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a querie
 */
exports.create = function (req, res) {
  var querie = new Querie(req.body);
  querie.user = req.user;

  querie.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(querie);
    }
  });
};

/**
 * Show the current querie
 */
exports.read = function (req, res) {
  res.json(req.querie);
};

/**
 * Update a querie
 */
exports.update = function (req, res) {
  var querie = req.querie;

  querie.title = req.body.title;
  querie.content = req.body.content;

  querie.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(querie);
    }
  });
};

/**
 * Delete an querie
 */
exports.delete = function (req, res) {
  var querie = req.querie;

  querie.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(querie);
    }
  });
};

/**
 * List of Queries
 */
exports.list = function (req, res) {
  Querie.find().sort('-created').populate('user', 'displayName').exec(function (err, queries) {
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
 * Querie middleware
 */
exports.querieByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Querie is invalid'
    });
  }

  Querie.findById(id).populate('user', 'displayName').exec(function (err, querie) {
    if (err) {
      return next(err);
    } else if (!querie) {
      return res.status(404).send({
        message: 'No querie with that identifier has been found'
      });
    }
    req.querie = querie;
    next();
  });
};
