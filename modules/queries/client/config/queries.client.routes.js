'use strict';

// Setting up route
angular.module('queries').config(['$stateProvider',
  function ($stateProvider) {
    // Queries state routing
    $stateProvider
      .state('queries', {
        abstract: true,
        url: '/queries',
        template: '<ui-view/>'
      })
      .state('queries.list', {
        url: '',
        templateUrl: 'modules/queries/client/views/list-queries.client.view.html'
      })
      .state('queries.create', {
        url: '/create',
        templateUrl: 'modules/queries/client/views/create-querie.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('queries.view', {
        url: '/:querieId',
        templateUrl: 'modules/queries/client/views/view-querie.client.view.html'
      })
      .state('queries.edit', {
        url: '/:querieId/edit',
        templateUrl: 'modules/queries/client/views/edit-querie.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
