describe("First unit testing",function(){
	var scope;
	beforeEach(angular.mock.module('redPandaapp'));
	beforeEach(angular.mock.inject(function ($rootScope, $controller) {
	        scope = $rootScope.$new();
	        rootscope = $rootScope;	
	        scope.totalServerItems = 0;
	        scope.tableOptions = {"listData":{"id":"53d74cc7e4b073d3664cd108","employeeId":"812","photoUrl":"/resources/redpanda/53d74cfbe4b073d3664cd109.jpg","thumbUrl":"/resources/redpanda/thumbnail.53d74cfbe4b073d3664cd109.jpg","firstName":"test","lastName":"create","fullName":"test create","nickname":"test create","isPartTime":true,"isContractor":true,"addressStreet":"Nungambakkam High Road","addressCity":"kodambakkam","addressStateCode":"CO","addressStateName":"Colorado","addressPostZip":"600034","addressLat":13.0531295,"addressLong":80.23792349999997,"hireDate":"2014-08-07","termDate":"2014-08-01","contactNumbers":[{"seq":0,"type":"email","details":"wwww@www.www"}],"departmentName":"Operations","departmentId":"53ac29159c1c37083b3d38ad","managerName":"test create","managerId":"53d74cc7e4b073d3664cd108","job":"Consultant","timeOff":[{"type":"Vacation","allowance":0.0,"taken":0.0},{"type":"Sick","allowance":0.0,"taken":0.0}]},"rowTemplate":'<div ng-dblclick="navigateToDetail(row)" ng-style="{ \'cursor\': row.cursor }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell {{col.cellClass}}"><div class="ngVerticalBar" ng-style="{height: rowHeight}" ng-class="{ ngVerticalBarVisible: !$last }">&nbsp;</div><div ng-cell></div></div>',"columnDefs":	[{field:'employeeId', displayName:'ID'}, {field:'', displayName:'',sortable:false,cellTemplate:'<span ng-if="row.entity.thumbUrl == null"><img ng-src="img/redPanda50.jpg" class="img-circle"/></span><span ng-if="row.entity.thumbUrl !=null"><img ng-src="{{row.entity.thumbUrl}}" class="img-circle"/></span>'},{field:'firstName', displayName:'First'},{field:'lastName', displayName:'Last'},{field:'job', displayName:'Job'},{field:'departmentName', displayName:'Department'},{field:'managerName', displayName:'Manager', width:'150px'},{field:'', displayName:'Type',sortable:false, cellTemplate:'<label class="label label-success" ng-show="!row.entity.isContractor">Employee</label><label ng-show="row.entity.isContractor" class="label label-info">Contractor</label>'},{field:'inactive', displayName:'Status',cellTemplate:'<label ng-show="row.entity[col.field]" class="label label-important">Terminated</label><label ng-show="!row.entity[col.field]" class="label label-success">Active</label>'},{field:'', displayName:'',sortable:false,cellTemplate:'<div class="emp-icons-container"><button class="btn" ng-class="{\'label-success\':row.entity.commentsExist,\'label-grey\':!row.entity.commentsExist}"><i class="fa fa-comment"></i></button><button class="btn" ng-class="{\'label-info\':row.entity.attachmentsExist,\'label-grey\':!row.entity.attachmentsExist}"> <i class="fa fa-folder-open"></i> </button></div>'}], "useExternalSorting":true,"filterOptions":scope.filterOptions,"pageOptions":scope.pagingOptions,"sortInfo":scope.sortInfo,"selectedItems": scope.selectedData}
	        scope.filterOptions={filterText:'',useExternalFilter:false};
	        scope.pagingOptions = {pageSizes: [1, 10, 25, 50, 100],pageSize: 10,currentPage:1};
	        jasmine.Clock.useMock();
	        $controller('tableController', {$scope: scope,$rootScope:rootscope});
	        
	      
	}));
	it('Total number of items initially',function(){
		expect(scope.totalServerItems).toEqual(0);
	});
	it('Testing inital page size',function(){
		expect(scope.pagingOptions.pageSize).toEqual(10);
	});
	it('Testing inital page size',function(){
		expect(scope.pagingOptions.currentPage).toEqual(1);
	});
	
});
