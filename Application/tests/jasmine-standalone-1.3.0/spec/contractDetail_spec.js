describe("Contract Detail unit testing",function(){
	var scope, rootscope, location;
	beforeEach(angular.mock.module('redPandaapp'));
	beforeEach(angular.mock.inject(function ($rootScope, $controller, $injector,$location) {
	        scope = $rootScope.$new();
	        rootscope = $rootScope;
	        location = $location;
	        $controller('maincontroller', {$scope: scope,$rootScope:rootscope}); 
	        $controller('contractDetailController', {$scope: scope,$rootScope:rootscope,$location:location}); 
	        scope.contractDetail={"success":true,"total":1,"data":{"id":"53d80b2313a2e63528ae5378","poNumber":"PO 887664","title":"Double Shot","customerId":"53b41103353f736efcab467d","customerName":"Small World","type":"fee","value":0.0,"budgetedHours":67.0}}
	}));
	it('testing the selected menu',function(){
		expect(rootscope.selectedMenu).toEqual('Contract');
	});
	it('testing the Contract id',function(){
		expect(scope.contractDetail.data.customerId).toEqual('53b41103353f736efcab467d');
	});
	it('back button function',function(){
		scope.ClonedEmployeeDetail = scope.contractDetail;
		scope.backtocontract();
		var locationpath = location.path();
		expect(locationpath).toEqual('/Contract');
	});
	it('it should show attachments container', function(){
		scope.showUploadContainer();
		expect(scope.UploadDocumentsOptionVisible).toEqual(false);	
		expect(scope.attachmentsContainerVisible).toEqual(true);		
	});
	it('it should hide attachments container', function(){
		scope.hideUploadContainer();
		expect(scope.UploadDocumentsOptionVisible).toEqual(true);	
		expect(scope.attachmentsContainerVisible).toEqual(false);		
	});
	it('test case for deleting the Contract detail',function(){
		scope.confirmDelete();
		expect(rootscope.isPostSuccess).toEqual(null);
	});
	it('test case for moving to the Contract page if there is an error in API calls',function(){
		scope.isError = true;
		scope.backtocontract();
		var locationpath = location.path();
		expect(locationpath).toEqual('/Contract');
		
	});
	it('test case for saving the Contract detail',function(){
		scope.savecontractData();
		expect(scope.inSave).toEqual(true);
	});
	
});
