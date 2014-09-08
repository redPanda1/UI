describe("First unit testing",function(){
	var scope;
	beforeEach(angular.mock.module('redPandaapp'));
	beforeEach(angular.mock.inject(function ($rootScope, $controller,$cookieStore) {
	        scope = $rootScope.$new();
	        rootscope = $rootScope;	
	        cookiestore = $cookieStore;
	        $controller('maincontroller', {$scope: scope,$rootScope:rootscope}); 
	        $controller('mapController', {$scope: scope,$rootScope:rootscope,$cookieStore:cookiestore});
	        
	      
	}));
	
	it('Test case for setting the center of the map in initial state',function(){
		expect(scope.map.zoom).toEqual(12);
		expect(scope.map.center.latitude).toEqual(40);
		expect(scope.map.center.longitude).toEqual(-74.5);
	});
	it('Test case for setting the marker position',function(){
		expect(scope.marker.center.latitude).toEqual(40);
		expect(scope.map.center.longitude).toEqual(-74.5);
	});
	it('Test case for setting the marker position',function(){
		scope.mapOptions = {"success":true,"total":0,"data":{"id":"53ac1cac9c1c37083b3d38ab","employeeId":"PER00002","photoUrl":"/data/resources/53b2fd06e4b0123558f41fe4.jpeg","thumbUrl":"/data/resources/thumbnail.53b2fd06e4b0123558f41fe4.jpeg","firstName":"Simon","lastName":"Hopkins","fullName":"Simon Hopkins","nickname":"Simon Hopkins","addressLat":"13.0900","addressLong":"80.2700","isPartTime":true,"isContractor":false,"addressStreet":"15 Tarkington Court","addressCity":"Princeton","addressState":"NJ","addressZip":"08540","addressCountry":"US","departmentId":"53ac290d9c1c37083b3d38ac","job":"Developer","stdCostAmt":88.5,"stdCostCur":"USD","timeOff":[{"vacAll":20.0,"vacTaken":2.0,"vacBal":0.0,"sickAll":5.0,"sickTaken":2.5,"sickBal":0.0}]}};
		scope.addressKeys = ["addressStreet","addressCity","addressStateCode","addressPostZip","addressCountryISO"];
		scope.geocoding();
		expect(scope.mapOptions.data.addressLat).toEqual('13.0900');
		expect(scope.mapOptions.data.addressLong).toEqual('80.2700');
	});
	
});
