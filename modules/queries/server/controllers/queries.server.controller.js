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
var plotly = require('plotly')('matthewlv30','by8sgddokv');

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

function makePlots(query) {
  console.log('IN MAKEPLOTS');
  var data = [{ 
    x:[], 
    y:[], 
    type: 'bar' 
  }];
  var str;
  //console.log(query.query_results[0].MonthYear);
  for (var i = 0; i < query.query_results.length; i++) {
    str = ('' + query.query_results[i].MonthYear).substring(0, 4);
    str += '-' + ('' + query.query_results[i].MonthYear).substring(4, 6);
    str+= '-' + '30 00:00:00';
    data[0].x[i] = str;
    //query.query_results[i].MonthYear;
    str = '';
  }
  for (var j = 0; j < query.query_results.length; j++) {
    data[0].y[j] = query.query_results[j].f0_;
  }

  var layout = { 
    fileopt : 'overwrite', 
    filename : 'bar_graph'
  };

  //line plot
  plotly.plot(data, layout, function (err, msg) {
    if (err) return console.log(err);
    console.log(msg);
  });

  //TimeLine graph
  var data2 = [
    {
      x: [],
      y: [],
      type: 'scatter'
    }
  ];

  for (var k = 0; k < query.query_results.length; k++) {
    str = ('' + query.query_results[k].MonthYear).substring(0, 4);
    str += '-' + ('' + query.query_results[k].MonthYear).substring(4, 6);
    str+= '-' + '30 00:00:00';
    data2[0].x[k] = str;
    //query.query_results[i].MonthYear;
    str = '';
  } 

  for (var l = 0; l < query.query_results.length; l++) {
    data2[0].y[l] = query.query_results[l].f0_;
  }
  var graphOptions = {
    filename: 'timeline_graph', 
    fileopt: 'overwrite'
  };
  plotly.plot(data2, graphOptions, function (err, msg) {
    console.log(msg);
  });

  // // Scatter Plot

  // var trace1 = {
  //   x: [52698, 43117],
  //   y: [53, 31],
  //   mode: "markers",
  //   name: "North America",
  //   text: ["United States", "Canada"],
  //   marker: {
  //     color: "rgb(164, 194, 244)",
  //     size: 12,
  //     line: {
  //       color: "white",
  //       width: 0.5
  //     }
  //   },
  //   type: "scatter"
  // };
  // var trace2 = {
  //   x: [39317, 37236, 35650, 30066, 29570, 27159, 23557, 21046, 18007],
  //   y: [33, 20, 13, 19, 27, 19, 49, 44, 38],
  //   mode: "markers",
  //   name: "Europe",
  //   text: ["Germany", "Britain", "France", "Spain", "Italy", "Czech Rep.", "Greece", "Poland"],
  //   marker: {
  //     color: "rgb(255, 217, 102)",
  //     size: 12,
  //     line: {
  //       color: "white",
  //       width: 0.5
  //     }
  //   },
  //   type: "scatter"
  // };
  // var trace3 = {
  //   x: [42952, 37037, 33106, 17478, 9813, 5253, 4692, 3899],
  //   y: [23, 42, 54, 89, 14, 99, 93, 70],
  //   mode: "markers",
  //   name: "Asia/Pacific",
  //   text: ["Australia", "Japan", "South Korea", "Malaysia", "China", "Indonesia", "Philippines", "India"],
  //   marker: {
  //     color: "rgb(234, 153, 153)",
  //     size: 12,
  //     line: {
  //       color: "white",
  //       width: 0.5
  //     }
  //   },
  //   type: "scatter"
  // };
  // var trace4 = {
  //   x: [19097, 18601, 15595, 13546, 12026, 7434, 5419],
  //   y: [43, 47, 56, 80, 86, 93, 80],
  //   mode: "markers",
  //   name: "Latin America",
  //   text: ["Chile", "Argentina", "Mexico", "Venezuela", "Venezuela", "El Salvador", "Bolivia"],
  //   marker: {
  //     color: "rgb(142, 124, 195)",
  //     size: 12,
  //     line: {
  //       color: "white",
  //       width: 0.5
  //     }
  //   },
  //   type: "scatter"
  // };
  // var data = [trace1, trace2, trace3, trace4];
  // var layout = {
  //   title: "Quarter 1 Growth",
  //   xaxis: {
  //     title: "GDP per Capita",
  //     showgrid: false,
  //     zeroline: false
  //   },
  //   yaxis: {
  //     title: "Percent",
  //     showline: false
  //   }
  // };
  // var graphOptions = {layout: layout, filename: "scatter_plot", fileopt: "overwrite"};
  // plotly.plot(data, graphOptions, function (err, msg) {
  //     console.log(msg);
  // });



  //3D Plot
  var data3 = {
    x: [],
    y: [],
    mode: 'markers',
    marker: {
      size: 12,
      line: {
        color: 'rgba(217, 217, 217, 0.14)',
        width: 0.5
      },
      opacity: 0.8
    },
    type: 'scatter'
  };
  for (var m = 0; m < query.query_results.length; m++) {
    str = ('' + query.query_results[m].MonthYear).substring(0, 4);
    str += '-' + ('' + query.query_results[m].MonthYear).substring(4, 6);
    str+= '-' + '30 00:00:00';
    data3.x[m] = str;
    //query.query_results[i].MonthYear;
    str = '';
  } 

  for (var n = 0; n < query.query_results.length; n++) {
    data3.y[n] = query.query_results[n].f0_;
  }
  var graphOptions2 = {
    layout: layout, 
    filename: 'scatter_plot', 
    fileopt: 'overwrite'
  };
  plotly.plot(data3, graphOptions2, function (err, msg) {
    console.log(msg);
  });
}

/**
 * Show the current query
 */
exports.read = function (req, res) {
  makePlots(req.query);
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



