angular.module('redPandaApp').controller('HomePageController', ['$scope','$location','$http','$window','$rootScope','$cookieStore',
function($scope,$location,$http,$window,$rootScope,$cookieStore){

	$cookieStore.put("enableApplication",true);
	$rootScope.showApplication    = $cookieStore.get("enableApplication");


}]);
