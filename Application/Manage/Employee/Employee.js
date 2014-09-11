/**
 * Employee List Controller - Controller for the Employee List Page
 * @param $scope
 * @param $rootScope
 * @param $location
 * @param $http
 * @param $filter
 * @param $cookieStore
 * @param $timeout
 * @param $window
 */

function employeeController($scope,$rootScope,$location,$http,$filter,$cookieStore,$timeout,$window)
{
	 //Rootscope variables used to select the Accordion menus.
	 $rootScope.manage = true;
	 $rootScope.selectedMenu = 'Employee';
	 
	 //Employee List variables
	 $scope.totalServerItems = 0;//Total entries in the table - grid option
	 $scope.maxSize = 3;//AngularJS Bootstrap  pager option value
	 $scope.isDowloadClicked = false;
	 $scope.orderByField = '';
	 $scope.reverseSort = true;
	 $scope.previousSortIndex = '';	
	 $scope.formattedEmpList = [];
	 $scope.selectedData = [];
	 
	 //Used to maintain the same filter when navigating from different page  and corresponding detail page
	 if(!$rootScope.calledFromEmployeeDetail)
		 $rootScope.searchData = false;
	 else
		 $rootScope.calledFromEmployeeDetail = false;
		 
	 
	 $scope.isJsonFormattingNeeded = true; // If json formatting needed when sorting the table, we should set this flag.
	 $rootScope.closeAlert();
	 /**
	  * =============================================================================================================
	  * Sort Info Options for the ng-grid Table
	  * =============================================================================================================
	  */
	 $scope.sortInfo = {fields: ['', '', '', '', '' ,'', '',''], directions: ['']};
	 
	 
	 /**
	  * ============================================================================================================
	  * Filter option for the ngGrid
	  * ============================================================================================================
	  */
		 $scope.filterOptions={
			   filterText:'',
			   useExternalFilter:false   
		 }
		 
    /**
     * ===============================================================================================================
     * Paging option for ng-grid
     * ===============================================================================================================
     */
     $scope.pagingOptions = {
       pageSizes: [1, 10, 25, 50, 100],
       pageSize: 10,
       currentPage:1
     };
		 
		 
	 /**
	  * ==============================================================================================================
	  * Table Options for the partials - ngGrid
	  * listData - Input data
	  * rowTemplate - Define the row template
	  * columnDefs - Define the cell template
	  * useExternalSorting - boolean - True or false for using External sorting
	  * filterOptions - Define Filter Options
	  * pageOptions - Define page Options
	  * ===============================================================================================================
	  */
	 $scope.tableOptions={
			 			  "listData":null,
			 			  "rowTemplate":'<div ng-dblclick="navigateToDetail(row)" ng-style="{ \'cursor\': row.cursor }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell {{col.cellClass}}"><div class="ngVerticalBar" ng-style="{height: rowHeight}" ng-class="{ ngVerticalBarVisible: !$last }">&nbsp;</div><div ng-cell></div></div>',
			 			  "columnDefs":	[{field:'employeeId', displayName:'ID'}, {field:'', displayName:'',sortable:false,cellTemplate:'<span ng-if="row.entity.thumbUrl == null"><img ng-src="img/redPanda50.jpg" class="img-circle"/></span><span ng-if="row.entity.thumbUrl !=null"><img ng-src="{{row.entity.thumbUrl}}" class="img-circle"/></span>'},{field:'firstName', displayName:'First'},{field:'lastName', displayName:'Last'},{field:'job', displayName:'Job'},{field:'departmentName', displayName:'Department'},{field:'managerName', displayName:'Manager', width:'150px'},{field:'isContractor', displayName:'Type',cellTemplate:'<label class="label label-success" ng-show="!row.entity.isContractor">Employee</label><label ng-show="row.entity.isContractor" class="label label-info">Contractor</label>'},{field:'isInactive', displayName:'Status',cellTemplate:'<label ng-show="row.entity[col.field]" class="label label-important">Terminated</label><label ng-show="!row.entity[col.field]" class="label label-success">Active</label>'},{field:'', displayName:'',sortable:false,cellTemplate:'<div class="emp-icons-container"><button class="btn" ng-class="{\'label-success\':row.entity.commentsExist,\'label-grey\':!row.entity.commentsExist}"><i class="fa fa-comment"></i></button><button class="btn" ng-class="{\'label-info\':row.entity.attachmentsExist,\'label-grey\':!row.entity.attachmentsExist}"> <i class="fa fa-folder-open"></i> </button></div>'}],
			 			  "useExternalSorting":true,
			 			  "filterOptions":$scope.filterOptions,
			 			  "pageOptions":$scope.pagingOptions,
			 			  "sortInfo":$scope.sortInfo,
			 			  "selectedItems": $scope.selectedData
			 			  
	                     }
    
   /**
    * ===============================================================================================================
    * Function used to navigate to the Employee Detail page
    * when row in the employee list table is double clicked.
    * @param row
    * ===============================================================================================================
    */
   $scope.navigateToDetail = function(row)
   {		
	  if(row != null)
		  $cookieStore.put("detailId",row.entity.id);
	  else
		  $cookieStore.put("detailId","create");
	  
	  $rootScope.closeAlert();
	  $location.path('/EmployeeDetail');
   }
	 
	/**
	 * =============================================================================================================
	 * Function used to delete the selected employee from the list
	 * =============================================================================================================
	 */ 
	 $scope.DeleteEmployee = function()
	 {
		 if($scope.tableOptions.selectedItems.length > 0)
		 {
			 $rootScope.closeAlert();
			 $rootScope.showModal('/api/delete/contact/'+$scope.tableOptions.selectedItems[0].id,'Confirm Delete','Are you sure you would like to delete '+$scope.tableOptions.selectedItems[0].firstName+' '+$scope.tableOptions.selectedItems[0].lastName+'<span></span> ? This action can not be undone.','Cancel', 'Confirm');
			 $scope.$watch('isPostSuccess',function(nValue,oValue){
				if(nValue == null || (nValue == oValue))
					return;
				if($rootScope.isPostSuccess)
				{
					$rootScope.localCache.empList = null
					callEmployeeListAPI();
					$scope.tableOptions.selectedItems.length =0;
				}
				else
				{
					$rootScope.addAlert('Failed to delete. ',"danger","Error");
				}
				$rootScope.isPostSuccess = null;
			});
		 }
		 else
		 {
			 $rootScope.addAlert('Please select an Employee.',"warning","Warning");
		 }
	 }

   /**
    * =============================================================================================================
   	* Format JSON for excel sheet
   	* It is specific to the particular module.
   	* =============================================================================================================
   	*/
   $scope.formatJSONforDownload = function ()	   
   {		
	    if ($scope.employeeList == null) 
			return;  	
		var totalReportRecords = $scope.employeeList.length;
	    $scope.formattedEmpList = [];
		for (var i = 0; i < totalReportRecords; i++) {
			$scope.formattedEmpList[i] = angular.copy($scope.employeeList[i]);
			if (!$scope.formattedEmpList[i].isContractor) {
			   emptype = "Employee";
			} 
			else if ($scope.formattedEmpList[i].isContractor) {
				emptype = "Contractor";
			}
			
			if ($scope.formattedEmpList[i].inactive) {
			   inactive = "Terminated";
			}
			else {
			   inactive = "Active";
			}
			$scope.formattedEmpList[i].type = emptype;
			$scope.formattedEmpList[i].inactive = inactive;				
		} 	
	}   
	  

	   /**
	    * =======================================================================================
	    * Function used to Truncate photo url.
	    * Once the path sent from the server is correct, we can remove this function.
	    * =======================================================================================
	    */
	   $scope.truncateurl = function()
	   {
	   		
	   		for(var i=0;i<$scope.employeeList.length;i++)
	   		{	   			
	   			if(($scope.employeeList[i].thumbUrl != null) && ($scope.employeeList[i].thumbUrl != ''))
	   			{	   				
	   				var urlArray= $scope.employeeList[i].thumbUrl.split('/');
	   				if(urlArray.length == 8)
	   				{
	   					var constructedUrl = "/";
	   					for(var j=5; j<urlArray.length; j++)
	   					{
	   						constructedUrl+=urlArray[j];
	   						if(j != (urlArray.length -1))
	   							constructedUrl+="/";
	   					}
	   					$scope.employeeList[i].thumbUrl = constructedUrl;   					
	   				}

	   			}
	   		}
	   }
	   	  
	   /**
	    * ========================================================================================
	    * Function used to get all Manager Names for the Detail page.
	    * Loop through all the employee List and collect the first and last name
	    * and store it in rootScope.
	    * ========================================================================================
	    */
	    $scope.storeManagerNames = function()
	    {
			  $scope.managers = [];
			  angular.forEach($scope.employeeList,function(data,key){
				  if(!data.deleted && !data.isInactive)
				  {
					  if(data.firstName != null && data.lastName != null)
					  {
						   var manName = data.firstName+" "+data.lastName;
						   $scope.managers.push({"name":manName,"id":data.id});
					  }
					  else if(data.lastName != null)
					  {
						  var manName = data.lastName;
						  $scope.managers.push({"name":manName,"id":data.id});
					  }
				  }
			  });	
			  $rootScope.managerList = $scope.managers;
	    }
	   
	   /**
	    * ==========================================================================================
	    * Function used to generate the table contents
	    * ==========================================================================================
	    */
	    $scope.downloadTable = function()
	    {
	    	$scope.isDowloadClicked = true;
	    }
	    
	    
	 /**
	  * ================================================================================================
	  * Getting the JSON data for the employee list
	  * The API for sending with timestamp is '../api/employeeList?timestamp=2014-05-31T09:30-0500'
	  * ================================================================================================
	  */
	    
	 var  callEmployeeListAPI = function()
	 {
		 if($rootScope.localCache.empList == null || $rootScope.localCache.isEmpAPINeeded == true)
		 {
			 $http.get('/api/employeeList').success(function (data) {	
				 $scope.employeeList = data.data;
				 $rootScope.localCache.empList =  $scope.employeeList;	//employee List is stored in local cache.For avoiding unwanted API calls
				 $scope.truncateurl();  								//Function call used to truncate the photo-url path. 	
				 $scope.storeManagerNames(); 							//storing all the employee names for the manager list to use it in detail page.
				 $scope.tableOptions.listData = $scope.employeeList;    //Input for the ngGrid
				  
			 }).error(function(data, status){
				 
				 /**
				  * ==========================================================================
				  * Codes used for local testing. Finally it should be removed
				  * ==========================================================================
				  */
				 
				   $scope.employeeList =  $rootScope.employeeData.data;
			 	   $rootScope.localCache.empList =  $scope.employeeList;
			 	   $scope.truncateurl();
			 	   $scope.storeManagerNames();	 	  	
			 	   $scope.tableOptions.listData = $scope.employeeList;
				   if(status == 304)
				   {
					   //.
				   }    		
			 });
		 }
		 else
		 {
			
			 $scope.employeeList = $rootScope.localCache.empList;
			 $scope.tableOptions.listData = $scope.employeeList;
		 }

	 }
	 callEmployeeListAPI();
	 
}
