describe("First unit testing",function(){
	var scope;
	beforeEach(angular.mock.module('redPandaapp'));
	beforeEach(angular.mock.inject(function ($rootScope, $controller) {
	        scope = $rootScope.$new();
	        rootscope = $rootScope;	   
	        $controller('mainController', {$scope: scope,$rootScope:rootscope});
	      
	}));
	 
});
