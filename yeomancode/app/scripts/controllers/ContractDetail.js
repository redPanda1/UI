/**
 * contractDetailController - Controller for the Contract Detail page
 * @param $scope
 * @param $rootScope
 * @param $modal
 * @param $http
 * @param $location
 * @param $cookieStore
 * @param $timeout
 * @param CurrentTimeStamp
 * @param IsoDateFormat
 * @param USDateFormat
 * @param $window
 * @param $interval
 */
//function contractDetailController($scope,$rootScope,$modal,$http,$location,$cookieStore,$timeout,CurrentTimeStamp,IsoDateFormat,USDateFormat,$window,$interval)
//{	
angular.module('redPandaApp').controller('contractDetailController', ['$scope','$rootScope','$modal','$http','$location','$cookieStore','CurrentTimeStamp','IsoDateFormat','USDateFormat','$window','$timeout', 
	function($scope,$rootScope,$modal,$http,$location,$cookieStore,CurrentTimeStamp,IsoDateFormat,USDateFormat,$window,$timeout){

	$window.scrollTo(0,0);
	$rootScope.manage             = true;
	$rootScope.selectedMenu       = 'Contract';//Rootscope variables used to select the Accordion menus.
	$scope.ClonedcontractDetail   = {};//Object used to copy the contract detail object
	$scope.UploadDocumentsOptionVisible = true;
	$scope.attachmentsContainerVisible  = false;
	$scope.displayUpload          = true;
	$scope.disableDelete          =  false;	
	$scope.isError                = false;
	$rootScope.calledFromContractDetail = true;
	$scope.activitiesTableData    = [{"activity":"","duration":"","billable":"","hourlyRate":"","milestone":""}];
	$scope.invoicemethods = [{"value":"TM","description":"Activity Hourly Rate"},{"value":"Person","description":"Person Hourly Rate"},{"value":"Fixed","description":"Fixed Fee"}];
	$scope.personHourlyRate    = [];
	$scope.activeHourlyRate    = [];
	$scope.mileStone           = [];
	$scope.peopleMangers       = [{"name":"","manager":"","hourlyRate":""}];
	$scope.ActivitiesStartDate = [];
	$scope.ActivitiesEndDate   = [];
	$rootScope.managerName = [];
	$rootScope.selectedManager = [];
	$rootScope.alerts = [];
	$scope.nickNameList =[];
	$rootScope.ClonedSelectedManager = [];
	$scope.peopleMangerscheckbox = [];
	$scope.customerContractObj = {"id": "","title": "","poNumber": "","startDate": "","endDate": "","value": "","currency": "","customerId": "","customerName": "","commentsExist": false,"attachmentsExist": false,"deleted": false, "managerName":""}
	$scope.cookContractId = '';	
	$scope.customerID = $cookieStore.get("detailId");
	var timeInterval ="";
	var contractDetailCookId;
	
	 $('#dateRange').daterangepicker({
         format: 'MM/DD/YYYY',
         opens:'left'
       }, function(start, end, label) {
    	   var dateValue = $('#dateRange').val();
    	   var startDate = dateValue.split('-')[0];
		   var endDate = dateValue.split('-')[1];
		   $scope.contractDetail.data.startDate = IsoDateFormat.convert(startDate);
		   $scope.contractDetail.data.endDate = IsoDateFormat.convert(endDate);
       });
	
	//Create mode from customer
	if ($cookieStore.get("contractId") == "create"){
		$cookieStore.put("detailId","create");
		$scope.cookContractId = $cookieStore.get("contractId"); // used for ui display - selection box or label
		$cookieStore.remove("contractId");			
	}
	else{
		//Edit mode from customer
		if($cookieStore.get("contractId") != null){		
		    contractDetailCookId = $cookieStore.get("detailId");
		    $scope.cookContractId = $cookieStore.get("contractId");
			$cookieStore.put("detailId",$scope.cookContractId) 			
			$cookieStore.remove("contractId");				
		}
		else
	    {
			//From contract list page
			$scope.cookContractId = '';
	    }
	}
	
	
		
	//Redirect to contract page if history is cleared
	if($cookieStore.get("detailId") == null)
		$location.path('/Contract');

	
	/**
	 * ================================================================================================
	 * Duration Date validation for start and end date, start date should not be greater than end date
	 * =================================================================================================
	 */
    /*$('#startDate').datepicker({
    		dateFormat: 'mm-dd-yy',
            onSelect: function(dateStr) {      
                  var date = $(this).datepicker('getDate');
                  if (date) {
                        date.setDate(date.getDate() + 1);
                  }
                  $('#endDate').datepicker('option', 'minDate', date);
            }
      });*/
    
	  /**
	   * ================================================================================================
	   * Duration Date validation for start and end date, end date should not be lesser than start date
	   * =================================================================================================
	   */
      /*$('#endDate').datepicker({     
      		dateFormat: 'mm-dd-yy',      
            onSelect: function (selectedDate) {
                  var date = $(this).datepicker('getDate');
                  if (date) {
                        date.setDate(date.getDate() - 1);
                  }
                  $('#startDate').datepicker('option', 'maxDate', date || 0);
            }
      });*/


    /**
     * ===================================================================================================
     * Activity Date validation for start and end date, start date should not be greater than end date
     * @param index
     * ===================================================================================================
     */
	/*$scope.getCurrentStartDate = function(index){
		var id = $(document.activeElement).attr('id');	
		$scope.activityStartDate = "#"+id;				
		$scope.activityEndDate   = "#end_"+index;
		$("#"+id).datepicker({
	    	dateFormat: 'mm-dd-yy',
	        beforeShow : function(){
	            $( this ).datepicker('option','maxDate',$($scope.activityEndDate).val());           
	        }
	        
	    });
		 $($scope.activityStartDate).datepicker('show');
	}*/

    /**
     * =====================================================================================================
     * Activity date validation for start and end date, end date should not be lesser than start date
     * =====================================================================================================
     */
/*	$scope.getCurrentEndDate = function(index){
		var id = $(document.activeElement).attr('id');	
		$scope.activityEndDate   = "#"+id;		
		$scope.activityStartDate = "#start_"+index;	
		$("#"+id).datepicker({
	    	dateFormat: 'mm-dd-yy',
	        beforeShow : function(){
	            $( this ).datepicker('option','minDate',$($scope.activityStartDate).val());           
	        }	        
	    });
	    $($scope.activityEndDate).datepicker('show');
	}*/

	var plusHeaderCellTemplate = '<div class="ngHeaderSortColumn {{col.headerClass}}" ng-style="{\'cursor\': col.cursor}" ng-class="{ \'ngSorted\': !noSortVisible }">' +
    '<div ng-click="col.sort($event)" ng-class="\'colt\' + col.index" class="ngHeaderText" style="text-align:center;">{{col.displayName}} <button class="btn btn-default btn-sm" ng-click="addRow(peopleMangers,\'people\');"><i class="fa fa-plus"></i></button></div>' +
    '<div class="ngSortButtonDown" ng-show="col.showSortButtonDown()"></div>' +
    '<div class="ngSortButtonUp" ng-show="col.showSortButtonUp()"></div>' +
    '<div class="ngSortPriority">{{col.sortPriority}}</div>' +
    '<div ng-class="{ ngPinnedIcon: col.pinned, ngUnPinnedIcon: !col.pinned }" ng-click="togglePin(col)" ng-show="col.pinnable"></div>' +
    '</div>' +
    '<div ng-show="col.resizable" class="ngHeaderGrip" ng-click="col.gripClick($event)" ng-mousedown="col.gripOnMouseDown($event)"></div>';
	
	var plusHeaderCellTemplates = '<div class="ngHeaderSortColumn {{col.headerClass}}" ng-style="{\'cursor\': col.cursor}" ng-class="{ \'ngSorted\': !noSortVisible }">' +
    '<div ng-click="col.sort($event)" ng-class="\'colt\' + col.index" class="ngHeaderText" style="text-align:center;">{{col.displayName}} <button class="btn btn-default btn-sm" ng-click="addRow(activitiesTableData,\'activity\')"><i class="fa fa-plus"></i></button></div>' +
    '<div class="ngSortButtonDown" ng-show="col.showSortButtonDown()"></div>' +
    '<div class="ngSortButtonUp" ng-show="col.showSortButtonUp()"></div>' +
    '<div class="ngSortPriority">{{col.sortPriority}}</div>' +
    '<div ng-class="{ ngPinnedIcon: col.pinned, ngUnPinnedIcon: !col.pinned }" ng-click="togglePin(col)" ng-show="col.pinnable"></div>' +
    '</div>' +
    '<div ng-show="col.resizable" class="ngHeaderGrip" ng-click="col.gripClick($event)" ng-mousedown="col.gripOnMouseDown($event)"></div>';	
	
	

	 $scope.activitiesTableOptions = {
			data: 'activitiesTableData',
 	        multiSelect :false,        
 	        enableSorting: false,   
 	        rowHeight : 40,        
 	        headerRowHeight: 40,
 	        columnDefs: [ {field:'activity', displayName:'Activity', width:'20%',cellTemplate:'<div class="ngCellText calender-flex" style="width: 100%;"><input type="text" class="form-control"/></div>'},
 	        			  //{field:'duration', displayName:'Duration', width:'35%',cellTemplate:'<div class="ngCellText calender-flex" style="width: 100%;"><p class="input-group from-date mini-input"><span class="input-group-addon"><i class="fa fa-calendar"></i></span><input type="text" class="form-control" ng-model="ActivitiesStartDate[row.rowIndex]" id ="start_{{row.rowIndex}}" ng-click="getCurrentStartDate(row.rowIndex)" /></p> <span class="text-gap">to</span> <p class="input-group from-date mini-input"><span class="input-group-addon"><i class="fa fa-calendar"></i></span><input type="text" format="mm-dd-yy" id ="end_{{row.rowIndex}}" ng-click ="getCurrentEndDate(row.rowIndex)" ng-model="ActivitiesEndDate[row.rowIndex]" ng-change="checkDate(ActivitiesStartDate[row.rowIndex],ActivitiesEndDate[row.rowIndex])" class="form-control"/></p></div>'},
 	                      {field:'duration', displayName:'Duration', width:'20%',cellTemplate:'<div class="ngCellText calender-flex" style="width: 100%;"><p class="input-group from-date mini-input"><span class="input-group-addon"><i class="fa fa-calendar"></i></span><input  class="form-control"  type="text" style="background-color: white;cursor: pointer;width: 190px;" id ="start_{{row.rowIndex}}" readonly ng-focus="initiateDatePicker(row.rowIndex)" /></p></div>'},
 	        			  {field:'billable', displayName:'Billable', width:'15%',cellTemplate:'<div class="ngCellText" style="padding: 12px 0px 0px 20px !important;"><input type="checkbox"/></div>'},
 	        			  {field:'hourlyRate', displayName:'Hourly Rate', width:'19%', cellTemplate:'<div class="ngCellText" style="display:inline-block;width:100%;"><input type="text" hourly-Rate  placeholder="Rate"  class="form-control medium-input right_justify" ng-model="activeHourlyRate[row.rowIndex]" ng-disabled="contractDetail.data.type != invoicemethods[0].value"/></div>'},
 	        			  {field:'milestone', displayName:'Fixed Fee', width:'18%', cellTemplate:'<div class="ngCellText" style="display:inline-block;width:100%;><input type="text" hourly-Rate placeholder="Fixed Fee" class="form-control medium-input right_justify" ng-model="mileStone[row.rowIndex]" ng-disabled="contractDetail.data.type != invoicemethods[2].value"/></div>'},
 	        			  {field:'', displayName:'', width:'5%',headerCellTemplate:plusHeaderCellTemplates,cellTemplate:'<div class="ngCellText" style="display:inline-block;width:100%;text-align:center;"><button class="btn btn-default btn-sm" ng-click="deleteSelectedRow(row.rowIndex,activitiesTableData)"><i class="fa fa-times"></i></button></div>'},
 	        			]
	 }
	 $scope.peopleTableOptions = {
			    data: 'peopleMangers',
	 	        multiSelect :false,        
	 	        enableSorting: false,   
	 	        rowHeight : 40,        
	 	        headerRowHeight: 40,

	 	        columnDefs: [ {field:'name', displayName:'Name',width:'38%',cellTemplate:'<div class="ngCellText" style ="display:inline-block;width:100%;"><div ng-show="managerName[row.rowIndex]">{{managerName[row.rowIndex]}}</div><select ng-hide="managerName[row.rowIndex]" ng-options="value.name as value.name  for value in nickNames" ng-model ="managerName[row.rowIndex]" class ="form-control medium-input"> <option value="">-- Select --</option></select></div>'},
	 	        			  {field:'manager', displayName:'Manager',width:'19%',cellTemplate:'<div class="ngCellText" style="padding: 12px 0px 0px 20px !important;"><input ng-click="deselectOthers(row.rowIndex)" ng-model="peopleMangerscheckbox[row.rowIndex]" type="checkbox"></div>'},
	 	        			  {field:'hourlyRate', displayName:'Hourly Rate',width:'35%',cellTemplate:'<div class="ngCellText" style="display:inline-block;width:100%;"><input type="text" class="form-control medium-input right_justify" hourly-Rate  placeholder="Rate" ng-model="personHourlyRate[row.rowIndex]" ng-disabled="contractDetail.data.type != invoicemethods[1].value"/></div>'},
	 	        			  {field:'', displayName:'',width:'5%',headerCellTemplate:plusHeaderCellTemplate,cellTemplate:'<div class="ngCellText" style="display:inline-block;width:100%;text-align:center;"><button class="btn btn-default btn-sm" ng-click="deleteSelectedRow(row.rowIndex,peopleMangers)"><i class="fa fa-times"></i></button></div>'},
	 	        			]
	 }
	 
	 $scope.initiateDatePicker = function(index)
	 {
		 var elementId = '#start_'+index;
		 console.log(elementId);
		 $(elementId).daterangepicker({
	         format: 'MM/DD/YYYY'
	       }, function(start, end, label) {
	       });
	 }
	 
	 /**
	  * ==================================================================
	  * Function used to delete the selected row from the table
	  * @param index
	  * @param Array
	  * ==================================================================
	  */
	 $scope.deleteSelectedRow = function(index,Array)
	 {
		 Array.splice(index,1);
	 }
	 
    $scope.$watch('shiftNav', function(newVal, oldVal) {
        if (newVal != oldVal){
        	$scope.tableRebuild($scope.peopleTableOptions);
        	$scope.tableRebuild($scope.activitiesTableOptions);
        }
            
    }, true);
    
    /**
	 * Rebuilding the people and activity based on the new rows added
	 **/
    $scope.tableRebuild = function(ngtable){
        ngtable.$gridServices.DomUtilityService.RebuildGrid(
				ngtable.$gridScope,
				ngtable.ngGrid
		);
    }
    /**
     * ===================================================================
     * Function used to add row to the table
     * @param contents
     * ====================================================================
     */
    $scope.addRow = function(contents, type)
    {
        contents.push({});
        var tableObj; 
		if (type == "people")
			tableObj =  $scope.peopleTableOptions;
		else
			tableObj = $scope.activitiesTableOptions;
        
		$scope.tableRebuild(tableObj)
    }

	
	 /**
	  * ================================================================
	  * Function used to Deselect the checkboxes
	  * ================================================================
	  */
	  $scope.deselectOthers = function(index)
	  {	  	
		  for(var i=0;i<$scope.peopleMangers.length;i++)
		  {
			  $scope.peopleMangerscheckbox[i] = false;  
		  }
		  $scope.peopleMangerscheckbox[index] = true;
		  $scope.contractDetail.data.managerName = $scope.managerName[index];
			
	  }
	 
	 /**
	  * ==============================================================
	  * Watcher used to clear the fields when it is disabled
	  * ==============================================================
	  */
	 $scope.$watch('contractDetail.data.type',function(nValue,oValue){
		 if(nValue == oValue || nValue == null )
			 return;
		 
		 if(nValue != $scope.invoicemethods[1].value)
		 {
			 for(var i=0;i< $scope.personHourlyRate.length;i++)
			 {
				 $scope.personHourlyRate[i] = "";
			 }
		 }	 
		 if(nValue != $scope.invoicemethods[0].value)
		 {
			 for(var i=0;i< $scope.activeHourlyRate.length;i++)
			 {
				 $scope.activeHourlyRate[i] = "";
			 }
		 }
		 if(nValue != $scope.invoicemethods[2].value)
		 {
			 for(var i=0;i< $scope.mileStone.length;i++)
			 {
				 $scope.mileStone[i] = "";
			 }
		 }
	 });
	 
	 /**
	  * ====================================================================================================
	  * Function used to convert the date to US Date format mm/dd/yyyy
	  * ====================================================================================================
	  */
	 $scope.convertToUSDateFormat = function()
	 {
		 var DateString = "";
		 if($scope.contractDetail.data.startDate != null)
			 DateString += USDateFormat.convert($scope.contractDetail.data.startDate,true);
		 if($scope.contractDetail.data.endDate != null)
			 DateString += "-"+USDateFormat.convert($scope.contractDetail.data.endDate,true);
		 $('#dateRange').val(DateString);
	 }
	 
	 /**
	  * =====================================================================================================
	  * API Call to get the contract Detail based on the contract id. 
	  * =====================================================================================================
	  */	
	 if($cookieStore.get("detailId") == 'create')
	 {	
		 $scope.contractDetail = {
				    "success": true,
				    "total": 1,
				    "data": {
				        "poNumber": null,
				        "title": null,
				        "customerId": null,
				        "customerName": null,
				        "type": "",
				        "value": null,
				        "budgetedHours": null
				    }
				}
            $scope.isNew = true;
		 if($scope.contractDetail.data.currency == null)
			 $scope.contractDetail.data.currency = 'USD';
	 }
	 else
	 {
		 if($cookieStore.get("detailId") != null)
		 {
			 $http.get('/api/contractDetail/'+$cookieStore.get("detailId")).success(function (data) {	
				 $scope.contractDetail      = data;
				 $scope.isError = false;
				 $scope.disableDelete = false;
				 $scope.disabledSave = false;
				 //Cloning the object before pre processing.
				 if($scope.contractDetail.data.value != null)
					 $scope.contractDetail.data.value = $scope.contractDetail.data.value.toFixed(2);	
				 angular.copy($scope.contractDetail,$scope.ClonedcontractDetail,true);
				 $scope.convertToUSDateFormat();
				 if($scope.contractDetail.data.managerName != null)
				 {
					 $scope.managerName[0] = $scope.contractDetail.data.managerName;
					 $scope.peopleMangerscheckbox[0] = true;
				 }	
				 if($scope.contractDetail.data.type == null)
					 $scope.contractDetail.data.type = $scope.invoicemethods[0].value;
				 if($scope.contractDetail.data.currency == null)
					 $scope.contractDetail.data.currency = 'USD';
			 
				 		
				// if (contractDetailCookId != "create" && $rootScope.customerName)
				 if($rootScope.fromCustomer)
		  				$scope.contractDetail.data.customerName = $rootScope.customerName;	
				 
			 }).error(function(data, status){
			 	//$scope.isError = true;				
			 	// $scope.disabledSave = true;
			 	  if($location.path() == '/ContractDetail')
			 		  $rootScope.addAlert("No contract details available.","danger");
			 	  
			 	//Code used for local testing and it should be removed finally
			 	  
				$scope.contractDetail=$rootScope.ContractDetailData;
				$scope.convertToUSDateFormat();
				
				 if($scope.contractDetail.data.type == null)
				 {
					 $scope.contractDetail.data.type = $scope.invoicemethods[0].value;
				 }
				 if($scope.contractDetail.data.value != null)
				 {
					 $scope.contractDetail.data.value = $scope.contractDetail.data.value.toFixed(2);
				 }
				 if($scope.contractDetail.data.currency == null)
					 $scope.contractDetail.data.currency = 'USD';
				angular.copy($scope.contractDetail,$scope.ClonedcontractDetail,true);
				console.log($scope.contractDetail);
				console.log($scope.contractDetail.data.currency);
			 });
		 }
				 
	 }	 	 
	 if($rootScope.localCache.customers == null || $rootScope.localCache.isFindCustomerAPINeeded)
	 {
		 $http.get('/api/customerList').success(function (data) {	
			 $scope.customerList  = data.data;
			 $rootScope.localCache.customers = $scope.customerList;
			 $rootScope.localCache.isFindCustomerAPINeeded = false;
		 }).error(function(data, status){
		    /*$rootScope.addAlert("Customer List is not available","danger");
			$scope.customerList =$rootScope.customerlist.data; 
		    $rootScope.localCache.customers = $scope.customerList;*/
		 });
	 }
	 else
	 {
		 $scope.customerList =  $rootScope.localCache.customers;
	 }


	 if($rootScope.localCache.managers == null)
	 {
		 $http.get('/api/employeeList').success(function (data) {	
			 $scope.employeeList =  data.data;
		 	  //Getting all the Manager Names for the Detail page
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
			 $scope.managerList  = $scope.managers;
			 $rootScope.localCache.managers = $scope.managerList;
			 $rootScope.peopleTableData = $scope.managerList; 
			 $scope.nickNames = $scope.managers;
		 }).error(function(data, status){
			$rootScope.addAlert("Manager List is not available","danger");
			
			//Code used for local testing and it should be removed finally
			
			$scope.employeeList =  $rootScope.employeeData.data;
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
			  $scope.managerList  = $scope.managers;
				 $rootScope.localCache.managers = $scope.managerList;
				 $rootScope.peopleTableData = $scope.managerList; 
				 $scope.nickNames = $scope.managers;
		 });
	 }
	 else
	 {
		 $scope.managerList =  $rootScope.localCache.managers;
		 $rootScope.peopleTableData = $scope.managerList;
		 $scope.nickNames = $rootScope.localCache.managers;
	 }
	 
	 /**
	  * ===================================================================
	  * Function used to set the changed date to the contractdetail key.
	  * ===================================================================
	  */
	 $scope.checkDateisChanged = function()
	 {
		 //For mapping the start Date and end Date
		 /*if($('#startDate').val() != "")
			 $scope.contractDetail.data.startDate = IsoDateFormat.convert($('#startDate').val());
		 else
			 $scope.contractDetail.data.startDate = "";
		 
		 if($('#endDate').val() != "")
			 $scope.contractDetail.data.endDate = IsoDateFormat.convert($('#endDate').val());
		 else
			 $scope.contractDetail.data.endDate = "";*/
	 }
	 
	 /**
	  * ========================================================================
	  * Function used to set the selected manager name in the people table.
	  * Used to Set the Manager name in the firt row's selection box.
	  * Used to check the first row's checkbox.
	  * ========================================================================
	  */
	 $scope.setPeopleData = function()
	 {
		 	 if($scope.peopleMangers.length == 1)
		 	 {
		 		 $scope.managerName[0]= $scope.contractDetail.data.managerName;
				 $scope.peopleMangerscheckbox[0] = true;
		 	 }
		 	 else
		 	 {
		 		var isValueSet = false;
		 		for(var i=0; i<$scope.peopleMangers.length; i++)
		 		{
		 			$scope.peopleMangerscheckbox[i] = false;
		 			if($scope.managerName[i] == $scope.contractDetail.data.managerName)
		 			{
		 				$scope.peopleMangerscheckbox[i] = true;
		 				isValueSet = true;
		 			}
		 		} 		
		 		if(!isValueSet)
		 		{
		 			$scope.peopleMangers.push({"name":"","manager":"","hourlyRate":""});
			 		$scope.managerName[$scope.peopleMangers.length -1]= $scope.contractDetail.data.managerName;
			 		$scope.peopleMangerscheckbox[$scope.peopleMangers.length -1] = true;
		 		}
		 		
		 	 }
			
	 }
	 
	 
	 
	 /**
	  * ===================================================================
	  * Function used to  format the post data before posting to the server
	  * ===================================================================
	  */
	 $scope.formatPostData = function ()
	 {
		 //For mapping the customer name with the customer id
		 angular.forEach($scope.customerList,function(data,key){
			if(data.customerName == $scope.contractDetail.data.customerName) 
				$scope.contractDetail.data.customerId = data.id;
		 });
		 angular.forEach($scope.managerList,function(data,key){
			    if(data.name == $scope.contractDetail.data.managerName) 
			    	$scope.contractDetail.data.managerId = data.id;
		 });
		 
		 if($scope.contractDetail.data.value == null)
		 {
			 if($scope.contractDetail.data.currency != null)
				 delete $scope.contractDetail.data.currency;
		 }
		 else
		 {
			 $scope.contractDetail.data.value = parseFloat($scope.contractDetail.data.value);
		 }
		 if($scope.contractDetail.data.budgetedHours != null)
			 $scope.contractDetail.data.budgetedHours = parseInt($scope.contractDetail.data.budgetedHours);
	
	 } 
	 /**
	  * ===================================================================================
	  * Function used to navigate back to the contract list page.
	  * It updates the contract Detail if there is any changes in the contract detail object or
	  * it will navigate back to the contract list page.
	  * ===================================================================================
	  */
	 $scope.backtocontract = function()
	 {
	 	  if ($scope.isError)
	 	  {
	 	  	 $location.path('/Contract');
	 	  	 $rootScope.closeAlert();
	 	  	 return;
	 	  }
	 	  
		 //To Skip saving during create
		 if(!($cookieStore.get("detailId") == 'create'))
		 {			 
			 if(!angular.equals($scope.ClonedcontractDetail,$scope.contractDetail))		 
			 {
			 	 if($scope.contractDetail.data.title == "" || $scope.contractDetail.data.title == null)
				 {
					 $rootScope.addAlert("You must enter a description for the contract to be saved.","danger");
					 return;
				 }
				 $rootScope.closeAlert();
				 $scope.checkDateisChanged();
				 $scope.savecontractData();
			 }
			 else
			 {
				 $rootScope.localCache.isContractAPINeeded = false;
			 }	 
		 }
		 else
		 {
			 $rootScope.localCache.isContractAPINeeded = false;
		 }
		 $rootScope.closeAlert();
		 if ($scope.cookContractId){
			$cookieStore.put("detailId",$scope.customerID);
			$location.path('/CustomerDetail');
		 }
		else{
			$location.path('/Contract');
		}

	 }
	 
	 /**
	  * ===================================================================================
	  * Function used to format the contrObj before assigning to the Customer object
	  * @param contrObj
	  * ====================================================================================
	  */
	 var formatContractCustomerData = function(contrObj)
	 {
		 $scope.customerContractObj.id       = contrObj.id;
		 $scope.customerContractObj.title    = contrObj.title;
		 $scope.customerContractObj.poNumber = contrObj.poNumber;
		 
		 if (contrObj.value != null){
			 contrObj.value =  Number(contrObj.value).toFixed(2);
			}
		 
		 if(contrObj.startDate != null && contrObj.startDate != "")
			 $scope.customerContractObj.startDate= USDateFormat.convert(contrObj.startDate,true);
			 
		 if(contrObj.endDate != null && contrObj.endDate != "")
			 $scope.customerContractObj.endDate= USDateFormat.convert(contrObj.endDate,true);
		
		 $scope.customerContractObj.value            = contrObj.value;
		 $scope.customerContractObj.customerId       = contrObj.customerId;
		 $scope.customerContractObj.customerName     = contrObj.customerName;
		 $scope.customerContractObj.commentsExist    = false;
		 $scope.customerContractObj.attachmentsExist = false;
		 $scope.customerContractObj.deleted          = false;
		 $scope.customerContractObj.currency         = contrObj.currency;
		 $scope.customerContractObj.managerName      = contrObj.managerName;
		 return $scope.customerContractObj;
	 }
	 /**
	  * ==================================================================================
	  * Function used to save the contract details when save button is clicked
	  * or when back button is clicked when there is any changes in the contract
	  * detail object.
	  * ==================================================================================
	  *  
	  */
	 $scope.savecontractData = function()
	 {
		 
		 if($scope.contractDetail.data.title == "" || $scope.contractDetail.data.title == null)
		 {
			 $rootScope.addAlert("You must enter a description for the contract to be saved.","danger");
			 return;
		 }
		 $scope.inSave = true;
		 
		 $scope.checkDateisChanged();
		 console.log(angular.equals($scope.ClonedcontractDetail,$scope.contractDetail))
		 console.log("cloned",$scope.ClonedcontractDetail)
		 console.log("contractDetail",$scope.contractDetail)
		 
		 if($scope.contractDetail.data.value != null && $scope.contractDetail.data.value == 0)
		 {
			 if($scope.contractDetail.data.currency != null)
				 delete $scope.contractDetail.data.currency;
		 }
		 
		 
		 //Comparing the objects to identify the changes
         $scope.needToSave = false;
         angular.forEach($scope.contractDetail.data,function(data,key){ 
        	console.log(data);
        	console.log($scope.ClonedcontractDetail.data[key]);
        	if(!angular.equals(data,$scope.ClonedcontractDetail.data[key]))
        		$scope.needToSave = true;
         });
        
		 if($scope.needToSave)		 
		 {			
			 console.log($scope.contractDetail.data.currency);
			 $rootScope.closeAlert();
			 $scope.formatPostData();
			 //Whenever user clicks outside the calendar once it is opened, it will trigger the cancel function.
			 //To avoid the following code is been added
			 if($scope.contractDetail.data.startDate == "NaN-NaN-NaN")
				 delete $scope.contractDetail.data.startDate;
			 if($scope.contractDetail.data.endDate == "NaN-NaN-NaN")
				 delete $scope.contractDetail.data.endDate;
			 
			 var postData = $scope.contractDetail.data;			 
			 var postTime =  CurrentTimeStamp.postTimeStamp();
			 $http({
			 		"method" : "post",
			 	 	"url"    : '/api/contractDetail/update?timestamp='+postTime,"data":postData,
			 	 	"headers": { "content-type":"application/json" }
			 }).success(function (data) {	
				 if($location.path() == '/ContractDetail')
					 $rootScope.addAlert("Updated successfully","success");
				 $scope.contractDetail = data;
				 $rootScope.localCache.isContractAPINeeded = true;
				 angular.copy($scope.contractDetail,$scope.ClonedcontractDetail,true);
				 if($cookieStore.get("detailId") == 'create')
				 {
				 	if (data.data.id == undefined){}
				 	else
				 	   $cookieStore.put("detailId",data.data.id);
				 }
				 $scope.inSave = false;
				 		timeInterval = $timeout(function() {
				 		if ($scope.cookContractId){
				 			$cookieStore.put("detailId",$scope.customerID);
							if ($scope.cookContractId =="create"){								
								var custObj ={};
                              	custObj = formatContractCustomerData($scope.contractDetail.data);
                              	if($rootScope.cutomerContractCopy.data.contractList == null)
                              		$rootScope.cutomerContractCopy.data.contractList = [];
                              	if($rootScope.cutomerContractCopy.data.contractIds == null)
                              		$rootScope.cutomerContractCopy.data.contractIds = [];
				 				$rootScope.cutomerContractCopy.data.contractList.push(custObj);
				 				$rootScope.cutomerContractCopy.data.contractIds.push(custObj.id);
							}
							else
							{
								var custObj ={};
                              	custObj = formatContractCustomerData($scope.contractDetail.data);
				 				$rootScope.cutomerContractCopy.data.contractList[$rootScope.rowIndex]=custObj;
				 				$rootScope.cutomerContractCopy.data.contractIds[$rootScope.rowIndex]=custObj.id;
							}
				 			$location.path('/CustomerDetail');
				 		}
				 		else
        				   $location.path('/Contract');
					}, 1000);
			 }).error(function(data, status){
				 if($location.path() == '/ContractDetail')
					 $rootScope.addAlert("Update failed","danger");
				 $scope.disabledSave = false;
				 //Code used for local testing and it should be removed finally
				 
				/*$scope.contractDetail = $rootScope.newContactDetails;
				$scope.inSave = false;

					if ($scope.cookContractId){
							$cookieStore.put("detailId",$scope.customerID);
							if ($scope.cookContractId =="create"){
								var custObj ={}
                              	custObj = formatContractCustomerData($scope.contractDetail.data)
				 				$rootScope.cutomerContractCopy.data.contractList.push(custObj);
				 				$rootScope.cutomerContractCopy.data.contractIds.push(custObj.id);
							}
							$location.path('/CustomerDetail');
					}
				 	else{
					 	$location.path('/Contract');
				 	}*/

			 });
		   }
		 }
 
	 /**
	  * ===================================================================================
	  * Function used to Delete the contract Record
	  * @param size - size of the pop up window
	  * =====================================================================================
	  */
	 $scope.confirmDelete = function(size)
	 {
		$rootScope.showModal('/api/delete/contract/'+$cookieStore.get("detailId")+'?timestamp='+CurrentTimeStamp.postTimeStamp(),'Confirm Delete','Are you sure you would like to delete '+$scope.contractDetail.data.title+'? This action can not be undone.','Cancel', 'Confirm');
		$scope.$watch('isPostSuccess',function(nValue,oValue){
			if(nValue == null || (nValue == oValue))
				return;
			if($rootScope.isPostSuccess)
			{
				$rootScope.localCache.isContractAPINeeded = true;
			 	$location.path('/Contract');			 	
			}
			else
			{
				$rootScope.addAlert("Delete Failed.","danger");
			}
			$rootScope.isPostSuccess = null;
		});	 
	 
	 }
	 /**
	  * ===================================================================================
	  * Show attachments container
	  * ==================================================================================
	  */
	  $scope.showUploadContainer = function () 
	  {
		$scope.UploadDocumentsOptionVisible = false;
		$scope.attachmentsContainerVisible = true;
	  }
	/**
	 * Hide attachments container
	 */
	  $scope.hideUploadContainer = function () 
	  {
		$scope.UploadDocumentsOptionVisible = true;
		$scope.attachmentsContainerVisible = false;
	  }
	 /**
	   * ==================================================================================
	   * Watcher for the contract List object
	   * ==================================================================================
	   */  
	  $scope.inSave = false;
	  $scope.$watch('contractDetail',function(nValue,oValue){  
		  if(!$scope.inSave)
		  {
			  if(nValue != oValue)
			  {				  
				  if(!angular.equals($scope.ClonedcontractDetail,$scope.contractDetail))
					  $scope.disabledSave = false;
			  }
		  }		  
  
	  },true);	

	  function randNum(){
	  	var randomNum = (Math.floor(Math.random() * 50) + 1)/(Math.floor(Math.random() * 50) + 50);
	  	return randomNum;
	  }
	 /**
	  * ==================================================================================
	  * Progress bar content
	  * ==================================================================================
	  */  
	   $scope.stackedProgress = function() {
       $scope.stacked = [];       
       var billed    = 0;//Math.round(randNum()*100);
       var unbilled  = 0;//Math.round(randNum()*100);
       var remaining = 0;//100 - billed -unbilled;
       valArray      = [billed, unbilled, remaining];
       var types     = ['success', 'warning', 'danger'];
	   for (var i = 0; i < types.length; i++) {	        
	        $scope.stacked.push({
	          value:valArray[i] ,
	          type: types[i]
	        });
	    }
	  };

  	  $scope.stackedProgress();
  	  
  /**
   * Destroying the interval on destroy of this page.
   */
  $scope.$on('$destroy', function() {
		$timeout.cancel(timeInterval);
	});


}]);

