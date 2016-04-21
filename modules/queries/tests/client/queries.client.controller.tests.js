'use strict';

(function () {
  // Queries Controller Spec
  describe('Queries Controller Tests', function () {
    // Initialize global variables
    var QueriesController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Queries,
      mockQuery;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Queries_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Queries = _Queries_;

      // create mock query
      mockQuery = new Queries({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An query about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Queries controller.
      QueriesController = $controller('QueriesController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one query object fetched from XHR', inject(function (Queries) {
      // Create a sample queries array that includes the new query
      var sampleQueries = [mockQuery];

      // Set GET response
      $httpBackend.expectGET('api/queries').respond(sampleQueries);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.queries).toEqualData(sampleQueries);
    }));

    it('$scope.findOne() should create an array with one query object fetched from XHR using a queryId URL parameter', inject(function (Queries) {
      // Set the URL parameter
      $stateParams.queryId = mockQuery._id;

      // Set GET response
      $httpBackend.expectGET(/api\/queries\/([0-9a-fA-F]{24})$/).respond(mockQuery);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.query).toEqualData(mockQuery);
    }));

    describe('$scope.create()', function () {
      var sampleQueriePostData;

      beforeEach(function () {
        // Create a sample query object
        sampleQueriePostData = new Queries({
          title: 'An query about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An query about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Queries) {
        // Set POST response
        $httpBackend.expectPOST('api/queries', sampleQueriePostData).respond(mockQuery);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the query was created
        expect($location.path.calls.mostRecent().args[0]).toBe('queries/' + mockQuery._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/queries', sampleQueriePostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock query in scope
        scope.query = mockQuery;
      });

      it('should update a valid query', inject(function (Queries) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/queries\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/queries/' + mockQuery._id);
      }));

      it('should set scope.error to error response message', inject(function (Queries) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/queries\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(query)', function () {
      beforeEach(function () {
        // Create new queries array and include the query
        scope.queries = [mockQuery, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/queries\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockQuery);
      });

      it('should send a DELETE request with a valid queryId and remove the query from the scope', inject(function (Queries) {
        expect(scope.queries.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.query = mockQuery;

        $httpBackend.expectDELETE(/api\/queries\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to queries', function () {
        expect($location.path).toHaveBeenCalledWith('queries');
      });
    });
  });
}());
