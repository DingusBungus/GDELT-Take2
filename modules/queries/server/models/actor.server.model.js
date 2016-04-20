'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * actor Schema
 */
var Schema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  code: String,
  name: String,
  type: String
});

var actor = mongoose.model('actor', Schema);
