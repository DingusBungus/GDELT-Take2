'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * query Schema
 */
var querySchema = new Schema({
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
  built_query: String,
  query_results: [{
    MonthYear: Number,
    f0_: Number
  }]
});

/* create a 'pre' function that adds the updated_at (and created_at if not already there) property */
querySchema.pre('save', function(next) {

  var currentDate = new Date();

  //if hasn't been created yet, set the date
  if (!this.created_at) {
    this.created_at = currentDate;
  }

  //always update this field
  this.updated_at = currentDate;

  //move to after the middleware
  next();
});

/* Use your schema to instantiate a Mongoose model */
var Query = mongoose.model('Query', querySchema);

/* Export the model to make it avaiable to other parts of your Node application */
module.exports = Query;