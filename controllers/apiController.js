"use strict";

angular.module('apiCtrl', ['firebase', 'firebase.utils', 'firebase.auth', 'ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/list', {
      controller: 'apiCtrl',
      templateUrl: 'partials/list'
    });
  }])


.constant("PROXY", {
  url: 'http://192.168.33.10:1337/api.brewerydb.com/v2'
})

.factory('storage', function () {
    var bucket = {};

    return {
        get: function (junk) {
            if (bucket.hasOwnProperty(junk)) {
                return bucket[junk];
            }
        },
        set: function (key, value) {
            bucket[key] = value;
        }
    };
})

.run(['storage', function(storage) {
   var ref = new Firebase("https://firsthalfcapstone.firebaseio.com/");
   console.log("auth response", ref.getAuth());

   // auth = $firebaseAuth(ref);
   var authData = ref.getAuth();

   if (authData === null) {

     } else {
       storage.set("userId", authData.uid);
     }
}])


  .controller('apiCtrl', ["$scope", "$http", "$firebaseArray", "PROXY", "storage",
    function($scope, $http, $firebaseArray, PROXY, storage){

  $scope.userId = storage.get("userId");
  // On page load, run ajax call
  runAjaxCall();

  function runAjaxCall() {
    $http.get(PROXY.url + "/beer/random/?key=21968057b17b1b5df00acdc6d8f3421a&format=json&hasLabels=Y&withBreweries=Y").
    then(function(data) {
      $scope.beer = {
        // Main data to be displayed on explore page:
        name: data.data.data.name,
        style: data.data.data.style.category.name,
        brewery: data.data.data.breweries[0].name,
        abv: data.data.data.abv + "%",
        ibu: data.data.data.ibu,
        labelMedium: data.data.data.labels.medium,
        description: data.data.data.description,
        // Additional data to store for Beer Detail view:
        styleDescrip: data.data.data.style.category.description,
        labelIcon: data.data.data.labels.icon,
        labelLarge: data.data.data.labels.large,
        breweryLoc: data.data.data.breweries[0].locations[0].locality,
        breweryCountry: data.data.data.breweries[0].locations[0].country.name,
        breweryWebsite: data.data.data.breweries[0].website,
        breweryType: data.data.data.breweries[0].locations[0].locationTypeDisplay,
        // User-specific data:
        rating: 0,
        dateAdded: new Date()
      }
      // console.log("data :", data);

      // **** Avoids errors when passing $scope.beer to Firebase.
      for (var key in $scope.beer) {
        if ($scope.beer[key] === undefined || $scope.beer[key] === (undefined + "%")) {
          $scope.beer[key] = "Not available.";
        }
      }

      console.log("Loaded beer: ", $scope.beer);
    }, function(data) {
      console.log(data)

    });
}

}]);