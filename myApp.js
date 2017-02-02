var app = angular.module('myApp', ['ngRoute'])

// Routes

  .config(['$routeProvider',function($routeProvider){
      $routeProvider.when('/',{
        templateUrl: 'home.html',
        controller: 'myCtrl'
      }).when('/countries.html',{
        templateUrl: 'countries.html',
        controller: 'countriesCtrl as countries',

      }).when('/:countryCode/capital',{
        templateUrl: 'country.html',
        controller: 'detailCtrl',
      }).otherwise('/')

    }])

    .config(function($sceProvider) {
  // Completely disable SCE.  For demonstration purposes only!
  // Do not use in new projects.
  $sceProvider.enabled(false);
});
    // Le controller

    app.controller("myCtrl", function() {

      // sup holmes?
    })

    app.controller("countriesCtrl", ["$scope", "list", "$location", "$route", function($scope, list, $location, $route) {

  		$scope.countryData = [];

  		list().then(function(skippy){
  			$scope.countryData = skippy['geonames'];

  		});

      $scope.countryDetails = function(countryCode){
        $location.path('/' + countryCode + "/capital");
        $route.reload();
      }
    }])

    .controller('detailCtrl', ['$scope', '$route', 'details', 'neighbours',function($scope, $route, details, neighbours){

      //sets the route path
     $scope.countryCode = $route.current.params.countryCode;

      //define array
      $scope.detailData = [];

      //request detailData and return results
      details($scope.countryCode).then(function(result){
        $scope.detailData = result;

        console.log($scope.detailData)

        $scope.countryName =  $scope.detailData.data.geonames[0].countryName;
        $scope.population  =  $scope.detailData.data.geonames[0].population;
        $scope.area = $scope.detailData.data.geonames[0].areaInSqKm;
        $scope.capital = $scope.detailData.data.geonames[0].capital;
        $scope.continent= $scope.detailData.data.geonames[0].continentName;
        $scope.upcode = angular.uppercase($scope.countryCode);
        $scope.lowcode = angular.lowercase($scope.countryCode);



        neighbours($scope.countryCode).then(function(result){


          $scope.neighbours = result.data.geonames;
          console.log(result.data.geonames)

        });
  });

  }])

    // Le Services


  app.factory('neighbours',['$http',function($http){
    return function(countryCode){
      return $http({
        url:'https://api.geonames.org/neighboursJSON?country='+ countryCode +'&username=thinkfulchris',
        method:'JSONP'
      })
    }
  }])



  app.factory('details',['$http', function($http){

    return function(countryCode){

    return $http({
      url:'https://api.geonames.org/countryInfoJSON?username=thinkfulchris',
      method: 'JSONP',
      params:{
        country: countryCode
      }
      });
    }

  }])


    app.factory('list',['$http', function ($http){



      return function(){
        return $http ({
          url:'https://api.geonames.org/countryInfoJSON?username=thinkfulchris',
          method: 'JSONP',
          cache: true



        }).then(function(response) {
          //console.log(response.data);
          return response.data;
        },
        function() {
          console.log('Failure...');
  });
      }
}]);
