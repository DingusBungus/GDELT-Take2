'use strict';

var USERNAME = 'matthewlv30';
var APIKEY = '4819224d0f0b5b2e9ebbae27130c77d04d70e61c';
var CartoDB = require('cartodb');

var sql = new CartoDB.SQL({user:{USERNAME}, api_key:{APIKEY}})

sql.execute("SELECT * FROM table_8279566294")
  //you can listen for 'done' and 'error' promise events
  .done(function(data) {
    console.log(data) //data.rows is an array with an object for each row in your result set
  });