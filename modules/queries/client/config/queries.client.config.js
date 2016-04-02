'use strict';

// Configuring the Queries module
angular.module('queries').run(['Menus',
  function (Menus) {
    // Add the queries dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Queries',
      state: 'queries',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'queries', {
      title: 'List Queries',
      state: 'queries.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'queries', {
      title: 'Create Queries',
      state: 'queries.create',
      roles: ['user']
    });
  }
]);
