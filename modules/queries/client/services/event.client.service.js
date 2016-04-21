'use strict';

//Queries service used for communicating with the queries REST endpoints
angular.module('queries').factory('events', ['$resource',
  function ($resource) {
    return $resource('api/events/:eventId', {
      queryId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
