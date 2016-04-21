'use strict';

// Queries controller
angular.module('queries').controller('QueriesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Queries',
  function ($scope, $stateParams, $location, Authentication, Queries) {
    $scope.authentication = Authentication;
    // Create new Querie
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'querieForm');

        return false;
      }

      // Create new Querie object
      var querie = new Queries({
        title: this.title,
        content: this.content
      });

      // Redirect after save
      querie.$save(function (response) {
        $location.path('queries/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Querie
    $scope.remove = function (querie) {
      if (querie) {
        querie.$remove();

        for (var i in $scope.queries) {
          if ($scope.queries[i] === querie) {
            $scope.queries.splice(i, 1);
          }
        }
      } else {
        $scope.querie.$remove(function () {
          $location.path('queries');
        });
      }
    };

      // Update existing Querie
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'querieForm');

        return false;
      }

      var querie = $scope.querie;

      querie.$update(function () {
        $location.path('queries/' + querie._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Queries
    $scope.find = function () {
      $scope.queries = Queries.query();
    };

    // Find existing Querie
    $scope.findOne = function () {
      $scope.querie = Queries.get({
        querieId: $stateParams.querieId
      });
    };
  }
]);
