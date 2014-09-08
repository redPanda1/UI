describe("Contract List unit testing",function(){
	var scope;
	beforeEach(angular.mock.module('redPandaapp'));
	beforeEach(angular.mock.inject(function ($rootScope, $controller, $injector) {
	        scope = $rootScope.$new();
	        rootscope = $rootScope;
	        rootscope = $rootScope;
	        rootscope.localCache = {};
	        rootscope.localCache.isContractAPINeeded = false;
	        rootscope.localCache.ContractList = {"success":true,"total":5,"dataType":"contractList","data":[{"id":"53d8077f13a2e63528ae5375","title":"Application Screens","poNumber":"PO 123456","value":0.0,"commentsExist":false,"attachmentsExist":false},{"id":"53d809ea13a2e63528ae5376","title":"Application Shell","poNumber":"PO 456789","value":0.0,"commentsExist":false,"attachmentsExist":false},{"id":"53d80ad913a2e63528ae5377","title":"Pile Driver","poNumber":"PO 098987","value":0.0,"commentsExist":false,"attachmentsExist":false},{"id":"53d80b2313a2e63528ae5378","title":"Double Shot","poNumber":"PO 887664","value":0.0,"commentsExist":false,"attachmentsExist":false},{"id":"53d80c0713a2e63528ae5379","title":"Pad Line","poNumber":"PO 776554","value":0.0,"commentsExist":false,"attachmentsExist":false}]};
	        $controller('maincontroller', {$scope: scope,$rootScope:rootscope}); 
	        $controller('ContractController', {$scope: scope,$rootScope:rootscope}); 
	        jasmine.Clock.useMock();
	}));
	
	it('Total number of items initially',function(){
		expect(scope.totalServerItems).toEqual(0);
	});
	
	it('checks the rootscope value for selectedmenu',function(){
		expect(rootscope.selectedMenu).toEqual('Contract');
	});
	
	it('checks the current page',function(){
		expect(scope.pagingOptions.currentPage).toEqual(1);
	});
	
	it('Checks whether external filter is used or not',function(){
		expect(scope.filterOptions.useExternalFilter).toEqual(false);
	});	
	
	it('Inital page size of the Contract list table',function(){
		expect(scope.pagingOptions.pageSize).toEqual(10);
	});	
	it('Testing the export of table contents',function(){
		scope.downloadTable();
		expect(scope.isDowloadClicked).toEqual(true);
	});	

	it('test case for formatting the data for downloading',function(){
		scope.ContractList = {"success":true,"total":5,"dataType":"contractList","data":[{"id":"53d8077f13a2e63528ae5375","title":"Application Screens","poNumber":"PO 123456","value":0.0,"commentsExist":false,"attachmentsExist":false},{"id":"53d809ea13a2e63528ae5376","title":"Application Shell","poNumber":"PO 456789","value":0.0,"commentsExist":false,"attachmentsExist":false},{"id":"53d80ad913a2e63528ae5377","title":"Pile Driver","poNumber":"PO 098987","value":0.0,"commentsExist":false,"attachmentsExist":false},{"id":"53d80b2313a2e63528ae5378","title":"Double Shot","poNumber":"PO 887664","value":0.0,"commentsExist":false,"attachmentsExist":false},{"id":"53d80c0713a2e63528ae5379","title":"Pad Line","poNumber":"PO 776554","value":0.0,"commentsExist":false,"attachmentsExist":false}]};
		scope.formatJSONforDownload();
		expect(scope.formattedContractList).toEqual({ success : true, total : 5, dataType : 'contractList', data : [ { id : '53d8077f13a2e63528ae5375', title : 'Application Screens', poNumber : 'PO 123456', value : 0, commentsExist : false, attachmentsExist : false }, { id : '53d809ea13a2e63528ae5376', title : 'Application Shell', poNumber : 'PO 456789', value : 0, commentsExist : false, attachmentsExist : false }, { id : '53d80ad913a2e63528ae5377', title : 'Pile Driver', poNumber : 'PO 098987', value : 0, commentsExist : false, attachmentsExist : false }, { id : '53d80b2313a2e63528ae5378', title : 'Double Shot', poNumber : 'PO 887664', value : 0, commentsExist : false, attachmentsExist : false }, { id : '53d80c0713a2e63528ae5379', title : 'Pad Line', poNumber : 'PO 776554', value : 0, commentsExist : false, attachmentsExist : false } ] });
	})
	it('test case for deleting the employee from the list',function(){
		scope.tableOptions.selectedItems = [];
		scope.confirmDelete();
		expect(rootscope.isPostSuccess).toEqual(null);
	});
	
	
});
