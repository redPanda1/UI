describe("Employee List unit testing",function(){
	var scope;
	beforeEach(angular.mock.module('redPandaApp'));
	beforeEach(angular.mock.inject(function ($rootScope, $controller, $injector) {
	        scope = $rootScope.$new();
	        rootscope = $rootScope;
	        rootscope = $rootScope;
	        rootscope.localCache = {};
	        rootscope.localCache.empList ={};
	        rootscope.localCache.isEmpAPINeeded = false;
	        scope.employeeData={"success":true,"total":5,"dataType":"employeeList","data":[{"id":"53ac1cac9c1c37083b3d38ab","employeeId":"PER00002","thumbUrl":"/data/resources/thumbnail.53b2fd06e4b0123558f41fe4.jpeg","firstName":"Simon","lastName":"Hopkins","job":"Developer","departmentName":"Development","inactive":false,"commentsExist":false,"attachmentsExist":false},{"id":"53ac275ee4b03340b6de4947","employeeId":"PER00003","thumbUrl":"/data/resources/thumbnail.53b2fd2de4b0123558f41fe5.jpeg","firstName":"Peter","lastName":"Blake","job":"Developer","departmentName":"Operations","inactive":false,"commentsExist":false,"attachmentsExist":false},{"id":"53ac2791e4b03340b6de4948","employeeId":"PER00005","thumbUrl":"/data/resources/thumbnail.53b2fd39e4b0123558f41fe6.jpeg","firstName":"Jennifer","lastName":"Harvey","job":"Accountant","departmentName":"Finance","managerName":"Peter Edgar Blake","isPartTime":false,"isContractor":false,"inactive":false,"commentsExist":false,"attachmentsExist":false},{"id":"53ac27b0e4b03340b6de4949","employeeId":"PER00099","thumbUrl":"/data/resources/thumbnail.53b2fc31e4b0123558f41fe2.jpeg","firstName":"Richard","lastName":"Minney","job":"Support","departmentName":"Consulting","managerName":"Peter Edgar Blake","isPartTime":false,"isContractor":true,"inactive":true,"commentsExist":false,"attachmentsExist":false},{"id":"53b435aa3c01cbf76dd3d796","employeeId":"PER00035","firstName":"Ellie","lastName":"Clarke","job":"Developer","departmentName":"Operations","inactive":false,"commentsExist":false,"attachmentsExist":false}]};
	        $controller('maincontroller', {$scope: scope,$rootScope:rootscope}); 
	        $controller('EmployeeController', {$scope: scope,$rootScope:rootscope}); 

	}));
	
	it('Total number of items initially',function(){
		expect(scope.totalServerItems).toEqual(0);
	});
	
	it('checks the rootscope value for selectedmenu',function(){
		expect(rootscope.selectedMenu).toEqual('Employee');
	});
	
	it('checks the current page',function(){
		expect(scope.pagingOptions.currentPage).toEqual(1);
	});
	
	it('Checks whether external filter is used or not',function(){
		expect(scope.filterOptions.useExternalFilter).toEqual(false);
	});	
	
	it('Inital page size of the Employee list table',function(){
		expect(scope.pagingOptions.pageSize).toEqual(10);
	});	
	/*it('Testing the export of table contents',function(){
		scope.downloadTable();
		expect(scope.isDowloadClicked).toEqual(true);
	})*/;	
	it('test case for storing manager names',function(){
		scope.employeeList = scope.employeeData.data;
		scope.storeManagerNames();
		expect(rootscope.managerList).toEqual([ { name : 'Simon Hopkins', id : '53ac1cac9c1c37083b3d38ab' }, { name : 'Peter Blake', id : '53ac275ee4b03340b6de4947' }, { name : 'Jennifer Harvey', id : '53ac2791e4b03340b6de4948' }, { name : 'Richard Minney', id : '53ac27b0e4b03340b6de4949' }, { name : 'Ellie Clarke', id : '53b435aa3c01cbf76dd3d796' } ]);
	});
	it('test case for formatting the data for downloading',function(){
		scope.employeeList = scope.employeeData.data;
		scope.formatJSONforDownload();
		expect(scope.formattedEmpList).toEqual([ { id : '53ac1cac9c1c37083b3d38ab', employeeId : 'PER00002', thumbUrl : '/data/resources/thumbnail.53b2fd06e4b0123558f41fe4.jpeg', firstName : 'Simon', lastName : 'Hopkins', job : 'Developer', departmentName : 'Development', inactive : 'Active', commentsExist : false, attachmentsExist : false, type : 'Employee' }, { id : '53ac275ee4b03340b6de4947', employeeId : 'PER00003', thumbUrl : '/data/resources/thumbnail.53b2fd2de4b0123558f41fe5.jpeg', firstName : 'Peter', lastName : 'Blake', job : 'Developer', departmentName : 'Operations', inactive : 'Active', commentsExist : false, attachmentsExist : false, type : 'Employee' }, { id : '53ac2791e4b03340b6de4948', employeeId : 'PER00005', thumbUrl : '/data/resources/thumbnail.53b2fd39e4b0123558f41fe6.jpeg', firstName : 'Jennifer', lastName : 'Harvey', job : 'Accountant', departmentName : 'Finance', managerName : 'Peter Edgar Blake', isPartTime : false, isContractor : false, inactive : 'Active', commentsExist : false, attachmentsExist : false, type : 'Employee' }, { id : '53ac27b0e4b03340b6de4949', employeeId : 'PER00099', thumbUrl : '/data/resources/thumbnail.53b2fc31e4b0123558f41fe2.jpeg', firstName : 'Richard', lastName : 'Minney', job : 'Support', departmentName : 'Consulting', managerName : 'Peter Edgar Blake', isPartTime : false, isContractor : true, inactive : 'Terminated', commentsExist : false, attachmentsExist : false, type : 'Contractor' }, { id : '53b435aa3c01cbf76dd3d796', employeeId : 'PER00035', firstName : 'Ellie', lastName : 'Clarke', job : 'Developer', departmentName : 'Operations', inactive : 'Active', commentsExist : false, attachmentsExist : false, type : 'Employee' } ]);
	});
	it('test case for deleting the employee from the list',function(){
		scope.tableOptions.selectedItems = [];
		scope.DeleteEmployee();
		expect(rootscope.isPostSuccess).toEqual(null);
	});
	
	
});

