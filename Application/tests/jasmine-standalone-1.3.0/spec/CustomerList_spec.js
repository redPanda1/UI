describe("Customer List unit testing",function(){
	var scope;
	beforeEach(angular.mock.module('redPandaapp'));
	beforeEach(angular.mock.inject(function ($rootScope, $controller, $injector,$location) {
	        scope = $rootScope.$new();
	        scope.path = $location.path()
	        rootscope = $rootScope;
	        rootscope.localCache = {}
	        rootscope.localCache.customerList ={}
	        scope.customerList = {"success":true,"total":2,"dataType":"customerList","data":[{"id":"53b54b2d406e304a0af096a1","customerId":"CUS002","customerName":"GeoHay","customerAddress":"Inman, SC","commentsExist":false,"attachmentsExist":false},{"id":"53b55c4eb583afd17f72170c","customerId":"CUS004","customerName":"Thompson PR","customerAddress":"New York, NY","commentsExist":false,"attachmentsExist":false}]}
	        $controller('customerController', {$scope: scope,$rootScope:rootscope}); 
	        scope.customerData = {"success":true,"total":2,"dataType":"customerList","data":[{"id":"53b54b2d406e304a0af096a1","customerId":"CUS002","customerName":"GeoHay","customerAddress":"Inman, SC","commentsExist":false,"attachmentsExist":false},{"id":"53b55c4eb583afd17f72170c","customerId":"CUS004","customerName":"Thompson PR","customerAddress":"New York, NY","commentsExist":false,"attachmentsExist":false}]}
	        jasmine.Clock.useMock();
	        rootscope.localCache.isCustomerAPINeeded = false;
	}));
	
	it('Total number of items initially',function(){
		expect(scope.totalServerItems).toEqual(0);
	});
	
	it('checks the rootscope value for selected menu',function(){
		expect(rootscope.selectedMenu).toEqual('Customer');
	});
	
	it('checks the current page',function(){
		expect(scope.pagingOptions.currentPage).toEqual(1);
	});
	
	it('Checks whether external filter is used or not',function(){
		expect(scope.filterOptions.useExternalFilter).toEqual(false);
	});	
	
	it('Inital page size of the Customer list table',function(){
		expect(scope.pagingOptions.pageSize).toEqual(10);
	});	
	it('Checks whether the download is done',function(){
		scope.generateReport()
		expect(scope.isDowloadClicked).toEqual(true);
	});	
	

	
});
