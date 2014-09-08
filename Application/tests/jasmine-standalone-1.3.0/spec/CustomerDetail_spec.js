describe("Customer Detail unit testing",function(){
	var scope, rootscope, location;
	beforeEach(angular.mock.module('redPandaapp'));
	beforeEach(angular.mock.inject(function ($rootScope, $controller, $injector,$location) {
	        scope = $rootScope.$new();
	        rootscope = $rootScope;
	        rootscope.localCache ={}
	        rootscope.localCache.states =null;
	        location = $location;
	        $controller('customerDetailController', {$scope: scope,$rootScope:rootscope,$location:location}); 
	        scope.CustomerDetail={"success": true,"total": 1,"data": {"id": "53e45d8986557f33d8f49d8e","customerId": "CUS062","customerName": "Lockheed Martin","addressStreet": "Operation Woodbridge Ave","addressStateCode": "NJ","addressStateName": "New Jersey","addressPostZip": "08817","addressISOCountry": "US","addressCountryName": "United States of America"}}

	}));
	it('testing the selected menu',function(){
		expect(rootscope.selectedMenu).toEqual('Customer');
	});	
	
	it('testing the customer id',function(){
		expect(scope.CustomerDetail.data.customerId).toEqual('CUS062');
	});
	it('back button function',function(){
		scope.ClonedCustomerDetail = scope.CustomerDetail;
		scope.backtoCustomer();
		var locationpath = location.path();
		expect(locationpath).toEqual('/Customer');
	});

	it('name text box value',function(){
		expect(scope.CustomerDetail.data.customerName).toEqual('Lockheed Martin');
	});

	it('test case for address value',function(){
		expect(scope.CustomerDetail.data.addressStreet).toEqual('Operation Woodbridge Ave');		
		expect(scope.CustomerDetail.data.addressStateName).toEqual('New Jersey');
		expect(scope.CustomerDetail.data.addressPostZip).toEqual('08817');
		expect(scope.CustomerDetail.data.addressISOCountry).toEqual('US');
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
	it('checks whether customer name is empty', function(){
		scope.saveCustomerData();
		expect(scope.CustomerDetail.data.customerName).not.toBe("");
		expect(scope.disabledSave).toEqual(true);
	});
	it('checks whether validation message is displayed if customer name is empty', function(){
		scope.saveCustomerData();
		scope.CustomerDetail.data.customerName = "";
		expect(scope.CustomerDetail.data.customerName).toBe("");
		scope.alerts =[];
		var len = scope.alerts.push({"message":"Enter Customer Name.","type":"danger"});		
		expect(len).toBeGreaterThan(0);
		expect(scope.alerts[0].message).toContain("Enter Customer Name.");
		expect(scope.alerts[0].type).toContain("danger");
	});
});
