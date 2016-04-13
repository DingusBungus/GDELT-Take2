'use strict';

// Queries controller
angular.module('queries').controller('QueriesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Queries', 'actors', 'events',
  function ($scope, $stateParams, $location, Authentication, Queries, actors, events) {
    $scope.authentication = Authentication;
    $scope.queryArgs = {
      country_actor1: '',
      ethnic_actor1: '',
      type_actor1: '',
      religion_actor1: '',
      knowngroup_actor1: '',
      event: '',
      start_day: '',
      start_month: '',
      start_year: '',
      end_day: '',
      end_month: '',
      end_year: '',
      by_month: false
    };

    $scope.actors = [];
    $scope.events = [];

    // Create new query
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'queryForm');
        return false;
      }

      // Create new query object
      var query = new Queries({
        country_actor1: $scope.queryArgs.country_actor1,
        ethnic_actor1: $scope.queryArgs.ethnic_actor1,
        type_actor1: $scope.queryArgs.type_actor1,
        religion_actor1: $scope.queryArgs.religion_actor1,
        knowngroup_actor1: $scope.queryArgs.knowngroup_actor1,
        event: $scope.queryArgs.event,
        start_day: $scope.queryArgs.start_day,
        start_month: $scope.queryArgs.start_month,
        start_year: $scope.queryArgs.start_year,
        end_day: $scope.queryArgs.end_day,
        end_month: $scope.queryArgs.end_month,
        end_year: $scope.queryArgs.end_year,
        by_month: $scope.queryArgs.by_month
      });

      // Redirect after save
      query.$save(function (response) {
        $location.path('queries/' + response._id);

        // Clear form fields
        $scope.queryArgs = {
          country_actor1: '',
          ethnic_actor1: '',
          type_actor1: '',
          religion_actor1: '',
          knowngroup_actor1: '',
          event: '',
          start_day: '',
          start_month: '',
          start_year: '',
          end_day: '',
          end_month: '',
          end_year: '',
          by_month: false
        };
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing query
    $scope.remove = function (query) {
      if (query) {
        query.$remove();

        for (var i in $scope.queries) {
          if ($scope.queries[i] === query) {
            $scope.queries.splice(i, 1);
          }
        }
      } else {
        $scope.query.$remove(function () {
          $location.path('queries');
        });
      }
    };

    // Update existing query
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'queryForm');

        return false;
      }

      var query = $scope.query;

      query.$update(function () {
        $location.path('queries/' + query._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Queries
    $scope.find = function () {
      $scope.queries = Queries.query();
    };

    // Find existing query
    $scope.findOne = function () {
      $scope.query = Queries.get({
        queryId: $stateParams.queryId
      });
    };

    $scope.confirmActor = function(index, type) {
      if (type === 'country') {
        $scope.queryArgs.country_actor1 = $scope.actors[index];
        $('#countryModal').modal('hide');
      } else if (type === 'type') {
        $scope.queryArgs.type_actor1 = $scope.actors[index];
        $('#typeModal').modal('hide');
      } else if (type === 'ethnic') {
        $scope.queryArgs.ethnic_actor1 = $scope.actors[index];
        $('#ethnicModal').modal('hide');
      } else if (type === 'religion') {
        $scope.queryArgs.religion_actor1 = $scope.actors[index];
        $('#religionModal').modal('hide');
      } else if (type === 'knowngroup') {
        $scope.queryArgs.knowngroup_actor1 = $scope.actors[index];
        $('#knowngroupModal').modal('hide');
      }
    };

    $scope.confirmEvent = function(index) {
      $scope.queryArgs.event = $scope.events[index];
      $('#eventModal').modal('hide');
    };

    $scope.findActors = function(){
      $scope.actors = actors.query();
    };

    $scope.findEvents = function() {
      $scope.events = events.query();
    };
  }
]);
