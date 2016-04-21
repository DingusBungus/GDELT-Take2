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
      event_object: '',
      start_day: '',
      start_month: '',
      start_year: '',
      end_day: '',
      end_month: '',
      end_year: '',
      by_month: false,
      built_query: '',
      query_results: []
    };

    $scope.actors = [];
    $scope.events = [];

    // Create new query
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        console.log('NOT VALID!');
        $scope.$broadcast('show-errors-check-validity', 'queryForm');
        return false;
      }
      $scope.built_query = $scope.query_builder();

      // Create new query object
      var query = new Queries({
        country_actor1: $scope.queryArgs.country_actor1,
        ethnic_actor1: $scope.queryArgs.ethnic_actor1,
        type_actor1: $scope.queryArgs.type_actor1,
        religion_actor1: $scope.queryArgs.religion_actor1,
        knowngroup_actor1: $scope.queryArgs.knowngroup_actor1,
        event_object: $scope.queryArgs.event_object,
        start_day: $scope.queryArgs.start_day,
        start_month: $scope.queryArgs.start_month,
        start_year: $scope.queryArgs.start_year,
        end_day: $scope.queryArgs.end_day,
        end_month: $scope.queryArgs.end_month,
        end_year: $scope.queryArgs.end_year,
        by_month: $scope.queryArgs.by_month,
        built_query: $scope.built_query,
        query_results: []
      });

      // Redirect after save
      query.$save(function (response) {
        $location.path('queries/' + response._id);

        //console.log(response._id);

        // Clear form fields
        $scope.queryArgs = {
          country_actor1: '',
          ethnic_actor1: '',
          type_actor1: '',
          religion_actor1: '',
          knowngroup_actor1: '',
          event_object: '',
          start_day: '',
          start_month: '',
          start_year: '',
          end_day: '',
          end_month: '',
          end_year: '',
          by_month: false,
          built_query: '',
          query_results: []
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
      $scope.queryArgs.event_object = $scope.events[index];
      $('#eventModal').modal('hide');
    };

    $scope.findActors = function(){
      $scope.actors = actors.query();
    };

    $scope.findEvents = function() {
      $scope.events = events.query();
    };
    /*
      country_actor1: '',
      ethnic_actor1: '',
      type_actor1: '',
      religion_actor1: '',
      knowngroup_actor1: '',
      event_object: '',
      start_day: '',
      start_month: '',
      start_year: '',
      end_day: '',
      end_month: '',
      end_year: '',
      by_month: false,
      built_query: ''
    */
    $scope.query_builder = function() {
      var count = 0;
      var q = 'SELECT MonthYear,COUNT(*)';
      q += ' FROM [gdelt-bq:full.events]';
      q += ' WHERE ';
      if ($scope.queryArgs.country_actor1.code !== null && $scope.queryArgs.country_actor1.code !== undefined) {
        q += 'Actor1CountryCode= \"' + $scope.queryArgs.country_actor1.code + '\"';
        count++;
      }

      if ($scope.queryArgs.ethnic_actor1.code !== null && $scope.queryArgs.ethnic_actor1.code !== undefined) {
        if (count > 0) {
          q += ' AND ';
        }
        q += 'Actor1EthnicCode= \"' + $scope.queryArgs.country_actor1.code + '\"';
        count++;
      }

      if ($scope.queryArgs.event_object.code !== null && $scope.queryArgs.event_object.code !== undefined) {
        if (count > 0) {
          q += ' AND ';
        }
        q += 'EventRootCode=\"' + $scope.queryArgs.event_object.code + '\"';
        count++;
      }

      if ($scope.queryArgs.start_year !== null && $scope.queryArgs.start_year !== undefined) {
        if (count > 0) {
          q += ' AND ';
        }
        console.log('MonthYear > ' + $scope.queryArgs.start_year + '' + $scope.queryArgs.start_month );
        q += 'MonthYear > ' + $scope.queryArgs.start_year + '' + $scope.queryArgs.start_month;
        count++;
      }

      if ($scope.queryArgs.end_year !== null && $scope.queryArgs.end_year !== undefined) {
        if (count > 0) {
          q += ' AND ';
        }
        q += 'MonthYear < ' + $scope.queryArgs.end_year + '' + $scope.queryArgs.end_month;
        count++;
      }

      if ($scope.by_month) {
        q += ' GROUP BY MonthYear ORDER BY MonthYear;';
      } else {
        q += ' GROUP BY Year ORDER BY Year;';
      }
      console.log(q);
      // var q = 'SELECT string(MonthYear) MonthYear, INTEGER(norm*100000)/1000 f0_ FROM ( SELECT Actor1CountryCode, EventRootCode, MonthYear, COUNT(1) AS c, RATIO_TO_REPORT(c) OVER(PARTITION BY MonthYear ORDER BY c DESC) norm FROM [gdelt-bq:full.events] GROUP BY Actor1CountryCode, EventRootCode, MonthYear ) WHERE Actor1CountryCode=\'' + $scope.queryArgs.country_actor1.code + '\' and EventRootCode=\'' + $scope.queryArgs.event_object.code + '\' ORDER BY Actor1CountryCode, EventRootCode, MonthYear;';
      // var q = 'SELECT MonthYear, count(IF(Actor1CountryCode=\'' + $scope.queryArgs.country_actor1.code + '\',1,null)) f0_ FROM [gdelt-bq:full.events] GROUP BY MonthYear ORDER BY MonthYear;';
      return q;
    };

    $scope.call = function() {
      console.log(typeof($scope.query.query_results));
    };

    $scope.populateDropdowns = function() {
      var select = document.getElementById('selectStartYear');
      var selectE = document.getElementById('selectEndYear');
      var i = 0;
      var el, el2;

      for(i = 2016; i >= 1979; i--) {
        el = document.createElement('option');
        el.textContent = i;
        el.value = i;
        select.appendChild(el);

        el2 = document.createElement('option');
        el2.textContent = i;
        el2.value = i;
        selectE.appendChild(el2);
      }

      select = document.getElementById('selectStartMonth');
      selectE = document.getElementById('selectEndMonth');

      for(i = 1; i <= 12; i++) {
        el = document.createElement('option');
        if (i < 10) {
          el.textContent = '0' + i;
          el.value = '0' + i;
        } else {
          el.textContent = i;
          el.value = i;
        }
        select.appendChild(el);

        el2 = document.createElement('option');
        if (i < 10) {
          el2.textContent = '0' + i;
          el2.value = '0' + i;
        } else {
          el2.textContent = i;
          el2.value = i;
        }
        selectE.appendChild(el2);
      }

      select = document.getElementById('selectStartDay');
      selectE = document.getElementById('selectEndDay');

      for(i = 1; i <= 31; i++) {
        el = document.createElement('option');
        el.textContent = i;
        el.value = i;
        select.appendChild(el);
        
        el2 = document.createElement('option');
        el2.textContent = i;
        el2.value = i;
        selectE.appendChild(el2);
      }
    };
  }
]);
