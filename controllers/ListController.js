"use strict";

angular.module('ListCtrl', ['firebase', 'firebase.utils', 'firebase.auth', 'ngRoute'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/list', {
      controller: 'ListCtrl',
      templateUrl: 'partials/list'
    });
  }])

  .constant("PROXY", {
    url: 'http://192.168.33.10:1337/api.brewerydb.com/v2'
  })

  .factory(['storage', function(storage) {
     var ref = new Firebase("https://firsthalfcapstone.firebaseio.com/users");
     console.log("auth response", ref.getAuth());

     // auth = $firebaseAuth(ref);
     var authData = ref.getAuth();

     if (authData === null) {
  
       } else {
         storage.set("userId", authData.uid);
       }
  }])

  .controller('ListCtrl', ['$scope', 'Auth', 'fbutil', '$http', 'PROXY', '$location', 'storage', '$firebaseObject', '$firebaseArray',
      function($scope, Auth, fbutil, $http, PROXY, $location, storage, $firebaseObject, $firebaseArray) {
      
      $scope.userId = storage.get("userId");
      $scope.dateAdded = Date();
      console.log(Date());

      var listRef = new Firebase("https://firsthalfcapstone.firebaseio.com/users/" + $scope.userId + "/list");
      $scope.beers = $firebaseArray(listRef);
      console.log($scope.dateAdded);
      // Order the collection by the value of the breweries key
      var query = listRef.orderByChild("breweries");

      // Auto-synched Firebase array object
      $scope.lists = $firebaseArray(query);
      console.log($scope.lists);
      // Convert Firebase array into native JS array
      $scope.lists.$loaded()
      .then(function(){
          angular.forEach($scope.lists, function(f) {
              console.log(f);
          })
      });


    $scope.refreshList = function () {
      $http({
        method: "GET",
        url: "/list/beer"
      }).
      success(function (data, status, headers, config) {
        $scope.songs = data;
      }).
      error(function (data, status, headers, config) {
        $scope.name = "Error!";
      });
    };

  }]);