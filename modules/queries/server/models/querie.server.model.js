'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * query Schema
 */
var Schema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },

  country_actor1: String,
  ethnic_actor1: String,
  type_actor1: String,
  religion_actor1: String,
  knowngroup_actor1: String,

  event_name: String,

  start_day: Number,
  start_month: Number,
  start_year: Number,
  end_day: Number,
  end_month: Number,
  end_year: Number,

  by_month: Boolean,

  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('query', Schema);
