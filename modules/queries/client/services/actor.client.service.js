'use strict';

//Queries service used for communicating with the queries REST endpoints
angular.module('queries').factory('actors', ['$resource',
  function ($resource) {
    return $resource('api/actors/:actorId', {
      queryId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
