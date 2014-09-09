describe("Employee Detail unit testing",function(){
	var scope, rootscope, location;
	beforeEach(angular.mock.module('redPandaApp'));
	beforeEach(angular.mock.inject(function ($rootScope, $controller, $injector,$location) {
	        scope = $rootScope.$new();
	        rootscope = $rootScope;
	        location = $location;
	        $controller('maincontroller', {$scope: scope,$rootScope:rootscope}); 
	        $controller('employeeDetailController', {$scope: scope,$rootScope:rootscope,$location:location}); 
	        scope.EmployeeDetail={"success":true,"total":0,"data":{"id":"53ac1cac9c1c37083b3d38ab","employeeId":"PER00002","photoUrl":"/data/resources/53b2fd06e4b0123558f41fe4.jpeg","thumbUrl":"/data/resources/thumbnail.53b2fd06e4b0123558f41fe4.jpeg","firstName":"Simon","lastName":"Hopkins","fullName":"Simon Hopkins","nickname":"Simon Hopkins","addressLat":"13.0900","addressLong":"80.2700","isPartTime":true,"isContractor":false,"addressStreet":"15 Tarkington Court","addressCity":"Princeton","addressState":"NJ","addressZip":"08540","addressCountry":"US","departmentId":"53ac290d9c1c37083b3d38ac","job":"Developer","stdCostAmt":88.5,"stdCostCur":"USD","timeOff":[{"vacAll":20.0,"vacTaken":2.0,"vacBal":0.0,"sickAll":5.0,"sickTaken":2.5,"sickBal":0.0}]}}
	        scope.contactNumberTypes = {"success":true,"total":1,"data":["Phone","email","Skype","LinkedIn"]};
	        scope.employeeContactInfo = [{type:'Phone', info:'+1 6099331784'}, 
								{type:'email', info:'fred.flintstone@rack-team.com'}]; 
	        scope.employeeNewContact.type = 'Skype';
	        scope.event = {'keyCode': 13};
	        scope.employeeNewContact.info = "dummy-skype-id";
	        rootscope.localCache.department = null;
	}));
	it('testing the selected menu',function(){
		expect(rootscope.selectedMenu).toEqual('Employee');
	});
	it('testing the employee id',function(){
		expect(scope.EmployeeDetail.data.employeeId).toEqual('PER00002');
	});
	it('back button function',function(){
		scope.ClonedEmployeeDetail = scope.EmployeeDetail;
		scope.backtoEmp();
		var locationpath = location.path();
		expect(locationpath).toEqual('/Employee');
	});
	it('testing whether employee is contractor or partime',function(){
		expect(scope.EmployeeDetail.data.isContractor).toEqual(false);
		expect(scope.EmployeeDetail.data.isPartTime).toEqual(true);
	});
	it('name text box value',function(){
		expect(scope.EmployeeDetail.data.nickname).toEqual('Simon Hopkins');
	});
	it('test case for address value',function(){
		expect(scope.EmployeeDetail.data.addressStreet).toEqual('15 Tarkington Court');
		expect(scope.EmployeeDetail.data.addressCity).toEqual('Princeton');
		expect(scope.EmployeeDetail.data.addressState).toEqual('NJ');
		expect(scope.EmployeeDetail.data.addressZip).toEqual('08540');
		expect(scope.EmployeeDetail.data.addressCountry).toEqual('US');
	});
	it('test case for department value',function(){
		expect(scope.EmployeeDetail.data.departmentId).toEqual('53ac290d9c1c37083b3d38ac');
	});
	it('test case for google maps - latitude and longitude values',function(){
		expect(scope.EmployeeDetail.data.addressLat).toEqual('13.0900');
		expect(scope.EmployeeDetail.data.addressLong).toEqual('80.2700');
	});
	it('test case for job type',function(){
		expect(scope.EmployeeDetail.data.job).toEqual('Developer');
	});
	it('test case for standard cost',function(){
		expect(scope.EmployeeDetail.data.stdCostAmt).toEqual(88.5);
	});
	
	it('employee contact type should not exceed the contactNumberTypes of json response', function(){
		scope.addEmployeeContactInfo();
		expect(scope.employeeNewContact.type).toEqual('Skype');
		expect(scope.employeeNewContact.info).toEqual('');
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
	it('test case for deleting the employee detail',function(){
		scope.confirmDelete();
		expect(rootscope.isPostSuccess).toEqual(null);
	});
	it('test case for assigning names',function(){
		scope.assignNames();
		expect(scope.EmployeeDetail.data.lastName).toEqual('Hopkins');
		expect(scope.EmployeeDetail.data.firstName).toEqual('Simon');
	});
});
