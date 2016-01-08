'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', [
    'myApp.config',
    'myApp.security',
    'myApp.home',
    'myApp.account',
    'myApp.login',
    'SearchCtrl',
    'apiCtrl',
    'ListCtrl',

  ])
  
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.otherwise({
      redirectTo: '/home'
    })
    .when("/addBeer", {
      controller: "SearchCtrl",
      templateUrl: "partials/addBeer.html",
    })
   .when("/list", {
      controller: "ListCtrl",
      templateUrl: "partials/list.html",
    })
    .otherwise({ redirectTo: '/' });
  }])
  
  .run(['$rootScope', 'Auth', function($rootScope, Auth) {
    // track status of authentication
    Auth.$onAuth(function(user) {
      $rootScope.loggedIn = !!user;
    });
  }]);
