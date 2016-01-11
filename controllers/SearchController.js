"use strict";


angular.module('SearchCtrl', ['firebase', 'firebase.utils', 'firebase.auth', 'ngRoute'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/addBeer', {
      controller: 'SearchCtrl',
      templateUrl: 'partials/addBeer'
    });
  }])

  .constant("PROXY", {
    url: 'http://localhost:1337/api.brewerydb.com/v2'
  })

  .factory(['storage', function(storage) {
     var ref = new Firebase("https://beerlist.firebaseio.com/users");
     console.log("auth response", ref.getAuth());

     // auth = $firebaseAuth(ref);
     var authData = ref.getAuth();

     if (authData === null) {
  
       } else {
         storage.set("userId", authData.uid);
       }
  }])

.controller('SearchCtrl', ['$scope', 'Auth', 'fbutil', '$http', 'PROXY', '$location', 'storage', '$firebaseObject', '$firebaseArray',
    function($scope, Auth, fbutil, $http, PROXY, $location, storage, $firebaseObject, $firebaseArray) {
$scope.userId = storage.get("userId");


  $scope.search = function(){
    console.log("$scope.userInput", $scope.userInput);
    $http.get(PROXY.url + "/search/?&key=21968057b17b1b5df00acdc6d8f3421a&format=json&type=beer&withBreweries=Y&q="+$scope.userInput)
    .then(function(data) {
      console.log(data);
      $scope.results = data.data.data;
      $scope.beer = $scope.results[0];
      $scope.searched = true;
      // $scope.dateAdded = Date();
      // console.log(Date());

      //$scope.userInput = $scope.userData;
      console.log("results", $scope.results[0]);
      //console.log("results", $scope.userData)
    });
  }

   $scope.saveToList = function(userId){
    console.log("$scope.userInput", $scope.userInput);
    console.log($scope.beer);
      //1. Set up firebase reference to specific user id location
      //   i.e. : 'https://beerlist.firebaseio.com/users/{{user.id}}/{{newBeer}}'
      var userListRef = new Firebase("https://beerlist.firebaseio.com/users/" + $scope.userId + "/list");
      //2. Ensure we have the correct data (beer)
      console.log($scope.userInput);
      console.log($scope.beer);
      //3. Push that data to Firebase (firebaseReference.push(beer))
      userListRef.push({'beer': $scope.beer});
      $scope.saveSuccess = true;
      // userListRef.push({'dateAdded': $scope.dateAdded})
      //4. Make sure that beer has been saved (just for us to check, no need to write code for this)
      //

//Things to add.
      // add rating
      // ****** if savetoList ask for password else dont allow the beer to be added to list.

    }
}]);

 



