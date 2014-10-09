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
 * @param CommentDate
 */
angular.module('redPandaApp').controller('contractDetailController', ['$scope','$rootScope','$modal','$http','$location','$cookieStore','CurrentTimeStamp','IsoDateFormat','USDateFormat','$window','$timeout','CommentDate',
	function($scope,$rootScope,$modal,$http,$location,$cookieStore,CurrentTimeStamp,IsoDateFormat,USDateFormat,$window,$timeout,CommentDate){

	$window.scrollTo(0,0);
	$rootScope.manage             = true;
	$rootScope.selectedMenu       = 'Contract';//Rootscope variables used to select the Accordion menus.
	$scope.ClonedcontractDetail   = {};//Object used to copy the contract detail object
	$scope.ClonedcontractDetail.data   = {};
	$scope.UploadDocumentsOptionVisible = true;
	$scope.attachmentsContainerVisible  = false;
	$scope.displayUpload          = true;
	$scope.disableDelete          =  false;	
	$scope.isError                = false;
	$scope.isUpdateError		  = false;
	$rootScope.calledFromContractDetail = true;
	$scope.activitiesTableData    = [];
	$scope.invoicemethods = [{"value":"activity","description":"T&M - Activity Pricing"},{"value":"person","description":"T&M - Person Pricing"},{"value":"fixed","description":"Fixed Fee"}];
	$scope.personHourlyRate    = [];
	$scope.activeHourlyRate    = [];
	$scope.mileStone           = [];
    $scope.peopleMangers = [];
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
	var formatActivityData = []
	var formatPeopleData = [];
	$scope.customerID = $cookieStore.get("detailId");
	var timeInterval ="";
	var contractDetailCookId;
	$scope.employeeName = []
	$scope.fixedFeeAmount = []
	$scope.fixedFeeCurrency = [];
	$scope.activityDuration = []
	$scope.rateCurrency = [];
	$scope.clonedPeopleData = [];
	$scope.clonedActivityData = [];
	$scope.commentText = "";
	$rootScope.deleteCustomerContract = false;
	$scope.disabledSave = false;
	
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
	
	$scope.getEmployeeId = function(row,rowIndex) {

		angular.forEach($scope.nickNames, function(data, key) {
			if (row.entity.employeeName == data.name){
				$scope.peopleMangers[rowIndex]["employeeId"] = data.id
			}
		});
    }
	
		$scope.$watch('currencySymbol',function(nValue,oValue){
			console.log(nValue)
			if(nValue == null || (nValue == oValue))
				return;	
			if(nValue != oValue){
				for(var i=0;i< $scope.activitiesTableData.length;i++){
					$scope.activitiesTableData[i].feeCur = $scope.currencySymbol;
					$scope.activitiesTableData[i].rateCur = $scope.currencySymbol;
					
				}
				for(var i=0;i< $scope.peopleMangers.length;i++){
					$scope.peopleMangers[i].rateCur = $scope.currencySymbol;
					
				}
			}
		})
	//Redirect to contract page if history is cleared
	if($cookieStore.get("detailId") == null)
		$location.path('/Contract');
		


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
 	        tabIndex: 0,
		    noTabInterference: false,
 	        rowHeight : 40,        
 	        headerRowHeight: 40,
 	        columnDefs: [ {field:'title', displayName:'Activity', width:'20%',cellTemplate:'<div class="ngCellText text-center"><span ng-show ="row.rowIndex === 0"><input type="text" class="form-control inputtext" placeholder ="description" ng-model="row.entity.title" /></span><span ng-show ="row.rowIndex > 0"><input type="text" class="form-control inputtext"  ng-model="row.entity.title" /></span></div>'},
 	                      {field:'', displayName:'Duration', width:'25%',cellTemplate:'<div class="ngCellText cell-container"><p class="input-group from-date mini-input"><span class="input-group-addon"><i class="fa fa-calendar"></i></span><input  class="form-control"  type="text" style="background-color: white;cursor: pointer;width: 190px;" value = "{{activityDuration[row.rowIndex]}}" id ="start_{{row.rowIndex}}" ng-keyup ="clearActivityDate(row.rowIndex)"  ng-focus="initiateDatePicker(row,row.rowIndex)" /></p></div>'},
 	        			  {field:'isBillable', displayName:'Billable', width:'10%',cellTemplate:'<div class="ngCellText cell-container" style="padding: 12px 0px 0px 20px !important;"><input type="checkbox" ng-model="row.entity.isBillable" /></div>'},                
 	        			  {field:'rateAmt', displayName:'Hourly Rate', width:'19%', cellTemplate:'<div class="ngCellText cell-container"><div class="input-group"><span class="input-group-addon" ng-bind ="row.entity.rateCur"></span><input type="text" hourly-Rate  placeholder="Rate"  class="form-control inputtext right_justify" ng-model="row.entity.rateAmt" ng-disabled="contractDetail.data.type != invoicemethods[0].value"/></div></div>'},
 	        			  {field:'feeAmt', displayName:'Fixed Fee', width:'18%', cellTemplate:'<div class="ngCellText cell-container"><div class="input-group"><span class="input-group-addon" ng-bind ="row.entity.feeCur"></span><input type="text" hourly-Rate placeholder="Fixed Fee" class="form-control inputtext right_justify" ng-model="row.entity.feeAmt" ng-disabled="contractDetail.data.type != invoicemethods[2].value"/></div></div>'},
 	        			  {field:'', displayName:'', width:'8%',headerCellTemplate:plusHeaderCellTemplates,cellTemplate:'<div class="ngCellText button-container-align text-center"><button class="btn btn-default btn-sm" ng-click="deleteActivity(row,row.rowIndex,activitiesTableData)"><i class="fa fa-times"></i></button></div>'},
 	        			]
	 }
	 $scope.peopleTableOptions = {
			    data: 'peopleMangers',
	 	        multiSelect :false,        
	 	        enableSorting: false,   
	 	        rowHeight : 40,        
	 	        headerRowHeight: 40,
	 	        tabIndex: 0,
			    noTabInterference: false,
	 	        columnDefs: [{
            field: 'employeeName',
            displayName: 'Name',
            width: '38%',
            cellTemplate: '<div class="ngCellText text-center"><div ng-show="row.entity.employeeName" style ="text-align:left;text-indent:0px;">{{row.entity.employeeName}}</div><select ng-hide="row.entity.employeeName"  ng-options="value.name as value.name  for value in nickNames" ng-change = "getEmployeeId(row,row.rowIndex)" ng-model ="row.entity.employeeName" class ="form-control inputAddon" > <option value="">-- Select --</option></select></div>'
        }, {
            field: 'manager',
            displayName: 'Manager',
            width: '19%',
            cellTemplate: '<div class="ngCellText text-center" style="padding: 12px 0px 0px 20px !important;text-align:left;text-indent:0px;"><input ng-model="peopleMangerscheckbox[row.rowIndex]" ng-click ="deselectOthers(row.rowIndex)" type="checkbox"></div>'
        }, {
            field: 'rateAmt',
            displayName: 'Hourly Rate',
            width: '35%',
            cellTemplate: '<div class="ngCellText text-center"><div class="input-group"><span class="input-group-addon" ng-bind ="row.entity.rateCur"></span><input type="text" class="form-control mini-input right_justify" hourly-Rate  placeholder="Rate" ng-model="row.entity.rateAmt" ng-disabled="contractDetail.data.type != invoicemethods[1].value"/></div></div>'
        }, {
            field: '',
            displayName: '',
            width: '8%',
            headerCellTemplate: plusHeaderCellTemplate,
            cellTemplate: '<div class="ngCellText button-container-align text-center"><button class="btn btn-default btn-sm" ng-click="deleteSelectedRow(row.rowIndex,peopleMangers)"><i class="fa fa-times"></i></button></div>'
        } ]
	 }
	 
	 $scope.initiateDatePicker = function(row,index)
	 {
	 	 if($scope.activitiesTableData[index].start != null)
		 {
		 	row.entity.start = $scope.activitiesTableData[index].start;
		 	$scope.startrange = row.entity.start;			   
		 }	
		 else
		 {
		 	$scope.startrange = moment().format("MM/DD/YY");
		 	row.entity.start = $scope.startrange;
		 	$scope.activitiesTableData[index].start = row.entity.start;
		 }
		 if($scope.activitiesTableData[index].end != null)
		 {
		 	row.entity.end= $scope.activitiesTableData[index].end;
		 	$scope.endrange = row.entity.end;		 			 	
		 }	
		 else
		 {
		 	$scope.endrange = moment((moment().month()+1)+"/"+(moment().date()+1)+"/"+(moment().year())).format("MM/DD/YY");
		 	row.entity.end = $scope.endrange;
		 	$scope.activitiesTableData[index].end = $scope.endrange;	
		 }		
		 var elementId = '#start_'+index;
		 $(elementId).daterangepicker({
	         format: 'MM/DD/YY',
	         opens:'left',
	         startDate:$scope.startrange,
	         endDate:$scope.endrange
	       }, function(start, end, label) {	       	
		       var dateValue = $(elementId).val();
	    	   var startDate = dateValue.split('-')[0];
			   var endDate = dateValue.split('-')[1];
			   $scope.activitiesTableData[index].start = startDate;
			   $scope.activitiesTableData[index].end = endDate;
			   row.entity.start = startDate;
			   row.entity.end  = endDate;
	       });
	 }
	
	 /**
	  * ====================================================================================================
	  * Function used to convert the date to US Date format mm/dd/yyyy Activity data
	  * ====================================================================================================
	  */
	 $scope.convertDateActivities = function()
	 {
		 for(var i=0;i<$scope.contractDetail.data.activityData.length;i++){
	 		 var DateString = "";

	 		if($scope.contractDetail.data.activityData[i].start != null)
			{

				 DateString += USDateFormat.convert($scope.contractDetail.data.activityData[i].start,true);
				 $scope.contractDetail.data.activityData[i].start = USDateFormat.convert($scope.contractDetail.data.activityData[i].start,true);
			}	
		    if($scope.contractDetail.data.activityData[i].end != null)
			{
				DateString += "-"+USDateFormat.convert($scope.contractDetail.data.activityData[i].end,true);
				$scope.contractDetail.data.activityData[i].end = USDateFormat.convert($scope.contractDetail.data.activityData[i].end,true);
			}
		 	$scope.activityDuration[i] = DateString;		 	
		 }
	 }
	 
	 //Function used to set dollar symbol if there is not currency.
	 $scope.setDollar = function(obj)
	 {
		 if(obj == null)
			 obj = "USD";
		 return obj;
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
	  /**
	  * ==================================================================
	  * Function used to delete the selected row from the activity table
	  * @param index
	  * @param Array
	  * ==================================================================
	  */
	 $scope.deleteActivity = function (row,indexes, array){
		 $rootScope.deleteIndex = indexes;
		 var activityid = "";
		 if (row.entity.activityId != null)
		 	activityid = row.entity.activityId;
		 if (row.entity.id != null)
			 activityid = row.entity.id;
		 if (activityid != "")
		 {
		 	$rootScope.showModal('/api/delete/activity/'+activityid+'?timestamp='+CurrentTimeStamp.postTimeStamp(),'Confirm Delete','Are you sure you would like to delete ? This action can not be undone.','Cancel', 'Confirm');
			$scope.$watch('isPostSuccess',function(nValue,oValue){
				if(nValue == null || (nValue == oValue))
					return;
				if($rootScope.isPostSuccess)
				{
				 array.splice($rootScope.deleteIndex,1);
				}
				else
				{
					$rootScope.addAlert("Delete Failed.","danger");
				}
				$rootScope.isPostSuccess = null;
			});	 
		 }
		 else{
		 		array.splice($rootScope.deleteIndex,1);
		 }
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
        var tableObj; 
		if (type == "people"){
			contents.push({"rateCur":$scope.currencySymbol, "rateAmt":'0.00',"isBlocked": false});
			tableObj =  $scope.peopleTableOptions;
		}
		else
		{
			contents.push({"title": "","isBillable": false,"isFixedFee": false,"rateAmt":'0.00',"feeAmt": '0.00',"feeCur" : $scope.currencySymbol,"rateCur" : $scope.currencySymbol});
			tableObj =  $scope.activitiesTableOptions;
		}
		 
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
		  $scope.contractDetail.data.managerName = $scope.peopleMangers[index].employeeName;
			
	  }
	 
	 /**
	  * ====================================================================================================
	  * Function used to convert the date to US Date format mm/dd/yyyy
	  * ====================================================================================================
	  */
	 $scope.convertToUSDateFormat = function()
	 {
		 var DateString = "";
		 if($scope.contractDetail.data.startDate != null)
		 {
			 $scope.startDateRange = USDateFormat.convert($scope.contractDetail.data.startDate,true);
			 DateString += USDateFormat.convert($scope.contractDetail.data.startDate,true);
		 }
		 else
		 {
		 	$scope.startDateRange = moment().format("MM/DD/YY");
		 	$scope.contractDetail.data.startDate = IsoDateFormat.convert($scope.startDateRange);
		 }

		 if($scope.contractDetail.data.endDate != null)
		 {
			 $scope.endDateRange = USDateFormat.convert($scope.contractDetail.data.endDate,true);
			 DateString += "-"+USDateFormat.convert($scope.contractDetail.data.endDate,true);
		 }
		 else
		 {		 	
		 	 $scope.endDateRange = moment((moment().month()+1)+"/"+(moment().date()+1)+"/"+(moment().year())).format("MM/DD/YY");
			 $scope.contractDetail.data.endDate = IsoDateFormat.convert($scope.endDateRange);
		 }

		 $('#dateRange').val(DateString);
		 $('#dateRange').daterangepicker({
	         format: 'MM/DD/YY',
	         opens:'left',
	         startDate:$scope.startDateRange,
	         endDate:$scope.endDateRange
	       }, function(start, end, label) {
	    	   var dateValue = $('#dateRange').val();
	    	   var startDate = dateValue.split('-')[0];
			   var endDate = dateValue.split('-')[1];
			   $scope.contractDetail.data.startDate = IsoDateFormat.convert(startDate);
			   $scope.contractDetail.data.endDate = IsoDateFormat.convert(endDate);
	       });
	 }
	 /**
     * For saving live comments
     */
     $scope.saveCommentMessage = function() {
		 if ($scope.commentText === "")
			return;
		var currentdate = new Date();
		var currentISO = currentdate.toISOString();
		var commnetsTime = CommentDate.convertCommentDate(currentISO)

		var text = $scope.commentText;
		$scope.commentText = "";
		var seq = 0, len = $scope.contractDetail.data.comments.length;
		if (len === 0) {
			seq = 0;
		}
		else {
			seq = len; 
		}
		 $scope.contractDetail.data.comments.push({
				"seqNo": seq,
				"postedBy": {
					"thumbUrl": $rootScope.defaultUserImage,
					"name"	  : $rootScope.currentUserName,
					"id"  	  : $rootScope.currentUserId
				},
				"postedOn":currentISO,
				"replyTo": 0,
				"docRef": 0,
				"text": text
		});
		console.log($scope.contractDetail.data.comments);
				angular.forEach($scope.contractDetail.data.comments, function(data, key) {
					if (data.postedOn != null)
					    data['tempTime'] = CommentDate.convertCommentDate(data.postedOn)
				});

	 }
	 
	  $scope.getCurrencySymbol = function()
	 {
	 	angular.forEach($scope.currencies,function(data,key){
			 if($scope.contractDetail.data.currency == data.code)
			 {
				 $scope.contractDetail.data.currency = data.code;
				 if(data.symbol != null && data.symbol != ''){
				 	$scope.currencySymbol =data.symbol;
				 }
					 
				 else
					 $scope.currencySymbol =data.code;
					 
				$scope.currencyCode = data.code; 
			 }
		});
	 }

	 
	 /**
	  * ===========================================================
	  * Function used to set the currency code and currency symbol
	  * ==========================================================
	  */
	 $scope.initializeCurrencies = function()
	 {
		 if($scope.contractDetail != null && $scope.contractDetail.data != null)
		 {
			 if($scope.contractDetail.data.currency == null)
			 {
			 	 console.log($scope.contractDetail.data.type);
			 	 console.log($scope.contractDetail.data.activityData);
			 	 console.log($scope.contractDetail.data.assignedData);
			 	 $scope.contractDetail.data.currency = 'USD';
				 $scope.currencySymbol ='$';
				 $scope.currencyCode = 'USD';
			 	 if($scope.contractDetail.data.type == 'fixed' || $scope.contractDetail.data.type == 'activity')
			 	 {
			 	 	if($scope.contractDetail.data.activityData != null)
			 	 	{
			 	 		if($scope.contractDetail.data.activityData.length != 0)
			 	 		{
				 	 		for(var i=0;i<$scope.contractDetail.data.activityData.length;i++)
				 	 		{
				 	 			if($scope.contractDetail.data.activityData[i].feeCur != null)
				 	 			{
				 	 				$scope.contractDetail.data.currency = $scope.contractDetail.data.activityData[i].feeCur;								
									$scope.getCurrencySymbol();		
				 	 			}
				 	 			if($scope.contractDetail.data.activityData[i].rateCur != null)
				 	 			{
				 	 				$scope.contractDetail.data.currency = $scope.contractDetail.data.activityData[i].rateCur;								
									$scope.getCurrencySymbol();
				 	 			}
				 	 		}
			 	 		}
			 	 	}
			 	 }			 	 
			 	 else
			 	 {
			 	 	if($scope.contractDetail.data.assignedData != null)
			 	 	{
			 	 		if($scope.contractDetail.data.assignedData.length != 0)
			 	 		{
				 	 		for(var i=0;i<$scope.contractDetail.data.assignedData.length;i++)
				 	 		{
				 	 			
				 	 			if($scope.contractDetail.data.assignedData[i].rateCur != null)
				 	 			{
				 	 				$scope.contractDetail.data.currency = $scope.contractDetail.data.assignedData[i].rateCur;								
									$scope.getCurrencySymbol();
				 	 			}
				 	 		}
			 	 		}
			 	 	}
			 	 	
			 	 }
			 	 
				 
				 // $scope.contractDetail.data.currency = currencyObj.code;
			 }
			 else
			 {
				 if($scope.currencies != null)
				 {
					 $scope.getCurrencySymbol();
				 }
			 }
		 }
	 }
	 
	
	 /**
	  * ===============================================================================================
	  * API Call for Currencies
	  * ===============================================================================================
	  */
	    if ($rootScope.localCache.currencies == null) {
	        $http.get('/api/listData/currencies').success(function(data) {
	            $scope.currencies = data.data;
	            $rootScope.localCache.currencies = $scope.currencies;
	            $scope.initializeCurrencies();	
	        }).error(function(data, status) {
	        	console.log("No data found for currencies list");
	            //Code used for local testing and it should be removed finally.
	                /*$scope.localcurrencies       = {"success":true,"total":1,"data":[{"code":"USD","name":"US Dollar","symbol":"$","decimals":2.0},{"code":"CAD","name":"Canadian Dollar","symbol":"C$","decimals":2.0},{"code":"MXD","name":"Mexican Dollar","symbol":"MX$","decimals":2.0},{"code":"JPY","name":"Japanese Yen","symbol":"Â¥","decimals":0.0},{"code":"GBP","name":"British Pound","symbol":"Â£","decimals":2.0},{"code":"EUR","name":"Euro","symbol":"â‚¬","decimals":2.0},{"code":"ZAR","name":"Rand","symbol":"R","decimals":2.0},{"code":"INR","name":"Rupee","symbol":"â‚¹","decimals":2.0}]}		
					$scope.currencies            = $scope.localcurrencies.data;
					$rootScope.localCache.currencies = $scope.currencies;
					$scope.initializeCurrencies();	*/
	        });
	    } else {
	        $scope.currencies = $rootScope.localCache.currencies;
	        $scope.initializeCurrencies();	
	    }
	/*
	*	Setting the manager name for the given manager id from the list 
	*/
     var setManagerName = function(){
		if ($scope.contractDetail.data.managerId != null)
		{
			console.log($scope.contractDetail.data.managerName, $scope.contractDetail.data.managerId)
			if($scope.contractDetail.data.managerId != "")
			{
				angular.forEach($scope.nickNames,function(data,key){
					if($scope.contractDetail.data.managerId == data.id){
						$scope.contractDetail.data.managerName = data.name;
					}
				});
			}
		}
	}
	/*
	*Calling the employeeList api for populating the manager names in the manager selection box
	*/
	var getManagerList = function(){
	
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
				  if($cookieStore.get("detailId") != 'create')
				 	setManagerName();
			 }).error(function(data, status){
				$rootScope.addAlert("Manager List is not available","danger");
			
				//Code used for local testing and it should be removed finally
				/*
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
					 if($cookieStore.get("detailId") != 'create')
						 	setManagerName()*/
			 });
		 }
		 else
		 {
			 $scope.managerList =  $rootScope.localCache.managers;
			 $rootScope.peopleTableData = $scope.managerList;
			 $scope.nickNames = $rootScope.localCache.managers;
		     if($cookieStore.get("detailId") != 'create')
			 	setManagerName();
		 }
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
				        "title": '',
				        "type": "",
				        "comments": []
				    }
				}
		 $scope.isNew = true;
		 $scope.initializeCurrencies();	
		
		 if ($scope.contractDetail.data.assignedData == null)
			$scope.contractDetail.data.assignedData = [];
		 if($scope.contractDetail.data.activityData == null)
			$scope.contractDetail.data.activityData = [];
		 angular.copy($scope.contractDetail,$scope.ClonedcontractDetail,true);
		 $scope.convertToUSDateFormat();
		 $scope.contractDetail.data.activityData.push({"title": "","isBillable": false,"isFixedFee": false,"rateAmt":"0.00","feeAmt": '0.00',"feeCur" : $scope.currencySymbol,"rateCur" : $scope.currencySymbol});
		 $scope.contractDetail.data.assignedData.push({"rateCur":$scope.currencySymbol,"rateAmt":"0.00","employeeName":""});
		 $scope.ClonedcontractDetail.data.assignedData.push({"rateCur":$scope.currencySymbol,"rateAmt":"0.00","employeeName":""});
		 $scope.currencyCode = "USD";
		 $scope.activitiesTableData =  $scope.contractDetail.data.activityData;
		 $scope.peopleMangers       = $scope.contractDetail.data.assignedData;
		 $scope.contractDetail.data.type = $scope.invoicemethods[2].value;
		 getManagerList();
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
				 
				 //Condition used for making the number to 2 fixed position
				 if($scope.contractDetail.data.value != null)
					 $scope.contractDetail.data.value = $scope.contractDetail.data.value.toFixed(2);
				 if($scope.contractDetail.data.budgetedHours != null)
					 $scope.contractDetail.data.budgetedHours = $scope.contractDetail.data.budgetedHours.toFixed(2);
				 //Condition used for initialising the comments
				 if ($scope.contractDetail.data.comments == null)
			  		$scope.contractDetail.data.comments = [];
			  	else{
			  		angular.forEach($scope.contractDetail.data.comments, function(data, key) {
			  		if (data.postedOn != null)
					    data['tempTime'] = CommentDate.convertCommentDate(data.postedOn)
					if (data.postedBy != null){
						if (data.postedBy['thumbUrl'] == null || data.postedBy['thumbUrl'] == "")
								data.postedBy['thumbUrl'] = $rootScope.defaultUserImage;
					}

				});
			  	}
				 //Condition used for initialising the assigned and activity data
				 if ($scope.contractDetail.data.assignedData == null)
			  			$scope.contractDetail.data.assignedData = [];
			  	 if($scope.contractDetail.data.activityData == null)
			  			$scope.contractDetail.data.activityData = [];
			  	 
			  	 getManagerList();
			  	 
			  	 //Clone the object before formatting the data
				 angular.copy($scope.contractDetail,$scope.ClonedcontractDetail,true);
				 if($scope.ClonedcontractDetail.data.assignedData != null){
				 	if ($scope.ClonedcontractDetail.data.assignedData.length ===0)
						 $scope.ClonedcontractDetail.data.assignedData.push({"employeeName":""});
				 }
				 $scope.convertToUSDateFormat();
				 
				 if ($scope.contractDetail.data.activityData != null)
					 $scope.convertDateActivities();
				 if($scope.contractDetail.data.managerName != null)
				 {
					 $scope.managerName[0] = $scope.contractDetail.data.managerName;
					 $scope.peopleMangerscheckbox[0] = true;
				 }	
				 if($scope.contractDetail.data.type == null)
					 $scope.contractDetail.data.type = $scope.invoicemethods[2].value;
				 
				 $scope.initializeCurrencies();
				 		
				// if (contractDetailCookId != "create" && $rootScope.customerName)
				 if($rootScope.fromCustomer)
		  		{
		  			$scope.contractDetail.data.customerName = $rootScope.customerName;
		  			$scope.contractDetail.data.customerId = $rootScope.currentCustomerId;
		  		}

		  		if ($scope.contractDetail.data.type != null)
				{
					if ($scope.contractDetail.data.type == "fixed")
		 	 		{
		 	 			for(var i=0;i<$scope.contractDetail.data.activityData.length;i++){
		 	 				$scope.fixedFeeAmount[i] = $scope.contractDetail.data.activityData[i].rateAmt;
		 	 				$scope.contractDetail.data.activityData[i].rateAmt ='';
		 	 				$scope.fixedFeeCurrency[i] = $scope.contractDetail.data.activityData[i].rateCur;
		 	 				$scope.contractDetail.data.activityData[i].rateCur = ''
		 	 			}
		 	 		}
				}
		  		
		  		for (var i=0;i<$scope.contractDetail.data.assignedData.length;i++){
		  			$scope.contractDetail.data.assignedData[i].rateAmt = $scope.contractDetail.data.assignedData[i].rateAmt.toFixed(2);
		  		}
		  		if ($scope.contractDetail.data.type != null)
		  		{
		  			if ($scope.contractDetail.data.type == "activity" || $scope.contractDetail.data.type == "fixed") {
		            	//$scope.contractDetail.data.assignedData = [];
		            	//$scope.contractDetail.data.assignedData.push({"rateCur":$scope.currencySymbol});
		            	if($scope.contractDetail.data.activityData.length == 0)
		            		$scope.contractDetail.data.activityData.push({"title": "","isBillable": false,"isFixedFee": false,"rateAmt": '0.00',"feeAmt": '0.00',"feeCur" : $scope.currencySymbol,"rateCur" : $scope.currencySymbol});
		     		}
				 	if ($scope.contractDetail.data.type == "person") {
				     	//$scope.contractDetail.data.activityData = [];
				     	//$scope.contractDetail.data.activityData.push({"title": "","isBillable": false,"isFixedFee": false,"rateAmt": '0.00',"feeAmt": '0.00',"feeCur" : $scope.currencySymbol,"rateCur" : $scope.currencySymbol});
				     	if($scope.contractDetail.data.assignedData.length == 0)
				     		$scope.contractDetail.data.assignedData.push({"rateCur":$scope.currencySymbol,"rateAmt":0});
					}
		  		}
		  		angular.forEach($scope.contractDetail.data.activityData,function(data,key){
		  			if(data.rateAmt != null)
			  			data.rateAmt = Number(data.rateAmt).toFixed(2);
			  		if(data.feeAmt != null)
			  			data.feeAmt = Number(data.feeAmt).toFixed(2);
		  		});
		  		angular.forEach($scope.contractDetail.data.assignedData,function(data,key){
		  			if(data.rateAmt != null)
			  			data.rateAmt = Number(data.rateAmt).toFixed(2);//data.rateAmt.toString().toFixed(2);
		  		});
		  		if($scope.contractDetail.data.managerName != null)
		  		{
		  			
					if ($scope.contractDetail.data.assignedData != null){
							if($scope.contractDetail.data.assignedData.length == 0)							
								$scope.contractDetail.data.assignedData = [{"employeeName":""}];
							$scope.contractDetail.data.assignedData[0].employeeName = $scope.contractDetail.data.managerName;
							
					}
                    /*else
                    {
                    	$scope.contractDetail.data.assignedData =[];
                    	$scope.contractDetail.data.assignedData = [{"employeeName":""}];
						$scope.contractDetail.data.assignedData[0].employeeName = $scope.contractDetail.data.managerName;
                    }*/
                  }
				 $scope.activitiesTableData =  $scope.contractDetail.data.activityData;
                 $scope.peopleMangers       = $scope.contractDetail.data.assignedData;

			 }).error(function(data, status){
			 	 $scope.isError = true;
				 $scope.disabledSave = true;

			 	  if($location.path() == '/ContractDetail')
			 		  $rootScope.addAlert("No contract details available.","danger");
			 	  
			 	//Code used for local testing and it should be removed finally
			 	 
				/*$scope.contractDetail  = $rootScope.ContractDetailData;
				//Condition used for initialising the comments
				 if ($scope.contractDetail.data.comments == null)
			  		$scope.contractDetail.data.comments = [];
			  	else{
			  		angular.forEach($scope.contractDetail.data.comments, function(data, key) {
				    data['tempTime'] = CommentDate.convertCommentDate(data.postedOn)
				});
			  	}
				
				if ($scope.contractDetail.data != null)
					$scope.convertToUSDateFormat();
				console.log(">>",$scope.contractDetail.data)
				//console.log(">>>>>>",$scope.contractDetail.data.assignedData[0].employeeName)
				if ($scope.contractDetail.data.assignedData != null){
					if ($scope.contractDetail.data.assignedData.length > 0 || $scope.contractDetail.data.assignedData.length === 0)
						$scope.contractDetail.data.assignedData = [{"employeeName":""}]
						$scope.contractDetail.data.assignedData[0].employeeName = $scope.contractDetail.data.managerName;
				}
				
				console.log($scope.contractDetail.data.assignedData[0].employeeName)
				$scope.peopleMangers =  $scope.contractDetail.data.assignedData;
				console.log($scope.peopleMangers)
				 if($scope.contractDetail.data.type == null)
				 {
					 $scope.contractDetail.data.type = $scope.invoicemethods[2].value;
				 }
				 if($scope.contractDetail.data.value != null)
				 {
					 $scope.contractDetail.data.value = Number($scope.contractDetail.data.value).toFixed(2);
				 }
				 
				 if($scope.contractDetail.data.budgetedHours != null)
					 $scope.contractDetail.data.budgetedHours = Number($scope.contractDetail.data.budgetedHours).toFixed(2);
				
				 $scope.initializeCurrencies();
				 console.log($scope.contractDetail.data.activityData)
				 if ($scope.contractDetail.data.activityData != null)
				{
					angular.forEach($scope.contractDetail.data.activityData,function(data,key){
		  			if(data.rateAmt != null){
		  			data.rateAmt = Number(data.rateAmt).toFixed(2)
		  			data.feeAmt = Number(data.feeAmt).toFixed(2)
		  			}
			  			
			  		if(data.feeAmt != null){}
			  			data.feeAmt = (data.feeAmt.toString())
			  		});
				}
				
				if ($scope.contractDetail.data.assignedData != null)
		  		{angular.forEach($scope.contractDetail.data.assignedData,function(data,key){
		  		console.log(data.rateAmt)
		  			if(data.rateAmt != null){}
			  			//data.rateAmt = data.rateAmt.toString().toFixed(2);
		  		}); }
				 
				angular.copy($scope.contractDetail,$scope.ClonedcontractDetail,true);
				
				if ($scope.contractDetail.data.type != null)
				{
					if ($scope.contractDetail.data.type == "fixed")
		 	 		{
		 	 			for(var i=0;i< $scope.contractDetail.data.activityData.length;i++){
		 	 				$scope.fixedFeeAmount[i] = $scope.contractDetail.data.activityData[i].rateAmt;
		 	 				$scope.contractDetail.data.activityData[i].rateAmt ='';
		 	 				$scope.fixedFeeCurrency[i] = $scope.contractDetail.data.activityData[i].rateCur;
		 	 				$scope.contractDetail.data.activityData[i].rateCur = ''
		 	 			}
		 	 		}
				}
				$scope.convertDateActivities();
				$scope.activitiesTableData =  $scope.contractDetail.data.activityData;*/
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
		    $rootScope.addAlert("Customer List is not available","danger");
			/*$scope.customerList =$rootScope.customerlist.data; 
		    $rootScope.localCache.customers = $scope.customerList;*/
		 });
	 }
	 else
	 {
		 $scope.customerList =  $rootScope.localCache.customers;
	 }
	 
	 /**
	  * ========================================================================
	  * Function used to set the selected manager name in the people table.
	  * Used to Set the Manager name in the firt row's selection box.
	  * Used to check the first row's checkbox.
	  * ========================================================================
	  */
	 $scope.setPeopleData = function(manager)
	 {
			
		 	 if($scope.peopleMangers.length == 1)
		 	 {
		 		 $scope.peopleMangers[0].employeeName= $scope.contractDetail.data.managerName;
				 $scope.peopleMangerscheckbox[0] = true;
		 	 }
		 	 else
		 	 {
		 		var isValueSet = false;
		 		for(var i=0; i<$scope.peopleMangers.length; i++)
		 		{
		 			$scope.peopleMangerscheckbox[i] = false;
		 			if($scope.peopleMangers[i].employeeName == $scope.contractDetail.data.managerName)
		 			{
		 				$scope.peopleMangerscheckbox[i] = true;
		 				isValueSet = true;
		 			}
		 		} 		
		 		if(!isValueSet)
		 		{
					var employeeId ="";
		 			angular.forEach($scope.nickNames, function(data, key) {
						if ($scope.contractDetail.data.managerName == data.name){
						employeeId = data.id
						}
					});
		 			$scope.peopleMangers.push({"employeeName":"","rateAmt":"0.00","employeeId":employeeId,"rateCur" : $scope.currencySymbol});
		 			
		 			$scope.peopleMangers[$scope.peopleMangers.length-1].employeeName = $scope.contractDetail.data.managerName
			 		$scope.peopleMangerscheckbox[$scope.peopleMangers.length -1] = true;
			 	}
			 }
		 }
	 /**
	  * ============================================================================================
	  * Function used to set the currency code and symbol on change
	  * ============================================================================================
	  */
	 $scope.setCurrencySymbol = function(currencyObj)
	 {
		 if(currencyObj != null)
		 {
			 if(currencyObj.symbol != null && currencyObj.symbol != '')
				 $scope.currencySymbol = currencyObj.symbol;
			 else
				 $scope.currencySymbol = currencyObj.code;
			 $scope.currencyCode =  currencyObj.code;
			 $scope.contractDetail.data.currency = currencyObj.code;
		 }
		 else
		 {
			 $scope.currencySymbol = '$';
			 $scope.contractDetail.data.currency = 'USD';
			 $scope.currencyCode =  'USD';
		 }
		 for(var i=0;i<$scope.activitiesTableData.length;i++){
		 	$scope.activitiesTableData[i].rateCur = $scope.contractDetail.data.currency;
		 	$scope.fixedFeeCurrency[i] = $scope.contractDetail.data.currency;
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
			 $scope.contractDetail.data.budgetedHours = parseFloat($scope.contractDetail.data.budgetedHours);
		
		if ($scope.contractDetail.data.comments.length>0){
        	angular.forEach($scope.contractDetail.data.comments,function(data,key){
					if (data.tempTime != null)
						delete data.tempTime;
					if(data.postedBy != null)
					{
						if (data.postedBy.thumbUrl)
							delete data.postedBy.thumbUrl;
						if (data.postedBy.name)
							delete data.postedBy.name;
					}
			});
        }

	/*
	*Formating the post object for activity and people
	*
	*/

	 } 
	 var formatActivityPeopleData = function(){
	 	 	$scope.filterPeopleList   = [];
	 	 	$scope.filterActivityList = [];

	 	 	//For loop for converting the data type of rate amt
			for(var i=0;i<$scope.peopleMangers.length;i++){
				if($scope.peopleMangers[i].rateAmt != "" || $scope.peopleMangers[i].rateAmt != null)
		 	 		$scope.peopleMangers[i].rateAmt = parseFloat($scope.peopleMangers[i].rateAmt);
	 	 	}
			
			//For mapping the employee id in the people managers array
	 	 	angular.forEach($scope.peopleMangers,function(peopleData,key){
				if (peopleData.employeeName != "" && peopleData.employeeName != null){
					angular.forEach($scope.nickNames, function(data, key) {
						if (peopleData.employeeName == data.name){
							peopleData.employeeId = data.id;
							
						}
					});
				}
			});

			//For pushing the valid people managers into the filtered list
			for (var i=0;i<$scope.peopleMangers.length;i++){
				if($scope.peopleMangers[i].employeeId != null && $scope.peopleMangers[i].employeeId != ''){
					$scope.filterPeopleList.push($scope.peopleMangers[i])
				}
			}
			//Removing the empty rows for the activity.
			for(var i=0; i<$scope.activitiesTableData.length;i++){	
				if($scope.activitiesTableData[i].title != null && $scope.activitiesTableData[i].title != "")
				{	
					console.log("Date value in the post");
					console.log($('#start_'+i).val())				
					if($('#start_'+i).val())
					{
						$scope.activitiesTableData[i].start = $('#start_'+i).val().split('-')[0];
						$scope.activitiesTableData[i].end = $('#start_'+i).val().split('-')[1];						
						$scope.activitiesTableData[i].start = IsoDateFormat.convert($scope.activitiesTableData[i].start);
						$scope.activitiesTableData[i].end = IsoDateFormat.convert($scope.activitiesTableData[i].end);
						
						console.log("After");
						console.log($scope.activitiesTableData[i].start ,$scope.activitiesTableData[i].end);

					}
					else
					{
						delete $scope.activitiesTableData[i].start;
						delete $scope.activitiesTableData[i].end;
					}

					$scope.filterActivityList.push($scope.activitiesTableData[i])
				}
			}
			
			angular.forEach($scope.filterPeopleList,function(peopleData,key){
				peopleData.rateCur =  $scope.currencyCode;
                    if(($scope.contractDetail.data.type == "fixed") ||($scope.contractDetail.data.type ==  'activity'))
                    {
                        delete peopleData.rateCur;
                        peopleData.rateAmt = 0;
                    }
			});
			
			angular.forEach($scope.filterActivityList,function(data,key){ 
				data.rateCur =  $scope.currencyCode;
				data.feeCur  =  $scope.currencyCode;
				data.feeAmt  = parseFloat(data.feeAmt)
				data.rateAmt  = parseFloat(data.rateAmt)
				data.isFixedFee  = false;
				//Deleting the rate amount and currencies for fixed type in activity table
				if ($scope.contractDetail.data.type == "fixed"){
					data.isFixedFee  = true;
					delete data.rateCur;
					data.rateAmt = 0;
				}
				if($scope.contractDetail.data.type ==  'activity'){
					delete data.feeCur;
					data.feeAmt = 0;
				}
                if($scope.contractDetail.data.type ==  'person'){
                    delete data.feeCur;
                    data.feeAmt = 0;
                    delete data.rateCur;
                    data.rateAmt =0;
                }
			});

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
	 	  if ($scope.isError || $scope.isUpdateError)
	 	  {
	 		 $rootScope.localCache.isContractAPINeeded = false; 
	 		 $rootScope.closeAlert();
	 	  	 if ($scope.cookContractId){
				$cookieStore.put("detailId",$scope.customerID);
				$location.path('/CustomerDetail');
		 	 }
			 else{
			 	$location.path('/Contract');
			 }
	 	  	 return;
	 	  }
	 	 $rootScope.localCache.isContractAPINeeded = false;
	 	 $rootScope.closeAlert();
	 	 
	 	 if ($scope.cookContractId){
			$cookieStore.put("detailId",$scope.customerID);
			$location.path('/CustomerDetail');
		 }
		else{
			$location.path('/Contract');
		 }
 	  	
	 	  /*
		 //To Skip saving during create
		 if(!($cookieStore.get("detailId") == 'create'))
		 {			 
			 if(!angular.equals($scope.ClonedcontractDetail,$scope.contractDetail))		 
			 {
			 	 if($scope.contractDetail.data.title == "" || $scope.contractDetail.data.title == null)
				 {
					 $rootScope.addAlert("You must enter a description for the contract to be saved.","danger");
					 $scope.isUpdateError = true;
					 return;
				 }
				 $rootScope.closeAlert();
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
			if(!($cookieStore.get("detailId") == 'create'))
					$location.path('/Contract');
		 }*/

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
	  * =================================================================================
	  * Function used to clear the date when key press happens in the duration field
	  * =================================================================================
	  */
	 $scope.clearDate = function()
	 {
		 $('#dateRange').val('');
		 $('#dateRange').daterangepicker({
	         format: 'MM/DD/YY',
	         opens:'left'
	       }, function(start, end, label) {
	    	   var dateValue = $('#dateRange').val();
	    	   var startDate = dateValue.split('-')[0];
			   var endDate = dateValue.split('-')[1];
			   $scope.contractDetail.data.startDate = IsoDateFormat.convert(startDate);
			   $scope.contractDetail.data.endDate = IsoDateFormat.convert(endDate);
	       });
	 }
	 
	 $scope.clearActivityDate = function(index){
	 	$('#start_'+index).val('');
		 $('#start_'+index).daterangepicker({
	         format: 'MM/DD/YY',
	         opens:'left'
	       }, function(start, end, label) {
	    	   var dateValue = $('#start_'+index).val();
	    	   var startDate = dateValue.split('-')[0];
			   var endDate = dateValue.split('-')[1];
			   $scope.activitiesTableData[index].start = IsoDateFormat.convert(startDate);
			   $scope.activitiesTableData[index].end = IsoDateFormat.convert(endDate);
			   row.entity.start = IsoDateFormat.convert(startDate);
			  row.entity.end  = IsoDateFormat.convert(endDate);
	       });
	 }
	 

	 /**
	  *
	  */

	 $scope.reformatData = function()
	 {
		 	for(var i=0;i<$scope.activitiesTableData.length;i++)
	   		{
	   			$scope.activitiesTableData[i].rateCur = $scope.currencySymbol;
	   			$scope.activitiesTableData[i].feeCur = $scope.currencySymbol;
	   			if($('#start_'+i).val())
	   			{
	   				$scope.activitiesTableData[i].start =  USDateFormat.convert($('#start_'+i).val().split('-')[0],true);
	   				$scope.activitiesTableData[i].end = USDateFormat.convert($('#start_'+i).val().split('-')[1],true);
	   			}
	   		}
	   		for(var i=0;i<$scope.peopleMangers.length;i++)
	   		{
	   			$scope.peopleMangers[i].rateCur = $scope.currencySymbol;
	   		}
	   		if($('#dateRange').val())
	   		{
	   			$scope.contractDetail.data.startDate = IsoDateFormat.convert($('#dateRange').val().split('-')[0]);
	   			$scope.contractDetail.data.endDate =  IsoDateFormat.convert($('#dateRange').val().split('-')[1]);
	   		}
	   		console.log('After Reformat');
	   		console.log($scope.activitiesTableData);
	   		console.log($scope.peopleMangers);
	   		console.log($scope.contractDetail.data.startDate);
	   		console.log($scope.contractDetail.data.endDate);

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
			 $scope.isUpdateError = true; // set error flag true
			 return;
		 }
		 $scope.inSave = true;

		 //console.log("cloned",$scope.ClonedcontractDetail)
		 //console.log("contractDetail",$scope.contractDetail)
		 
		 if($scope.contractDetail.data.value != null && $scope.contractDetail.data.value == 0)
		 {
			 if($scope.contractDetail.data.currency != null)
				 delete $scope.contractDetail.data.currency;
		 }

		 //console.log("Date value in post");
		 console.log($('#dateRange').val());
		 if($('#dateRange').val() == "")
		 {
		 	delete $scope.contractDetail.data.endDate;
		 	delete $scope.contractDetail.data.startDate;
		 }

		 //Comparing the objects to identify the changes
		 formatActivityPeopleData();
         $scope.needToSave = false;

         angular.forEach($scope.contractDetail.data,function(data,key){
         	 if(key != 'managerName') 
         	 {
	     	 	if(key == 'assignedData'){
					if($scope.contractDetail.data.assignedData != null)
		    	 	{
		    	 		for (var i=0;i<$scope.contractDetail.data.assignedData.length;i++){
		    	 			if($scope.contractDetail.data.assignedData[i].employeeName != null)
		    	 				delete $scope.contractDetail.data.assignedData[i].employeeName;
		    	 			if($scope.ClonedcontractDetail.data.assignedData != null){
		    	 				if ($scope.ClonedcontractDetail.data.assignedData[i].employeeName != null)
			        	 			delete $scope.ClonedcontractDetail.data.assignedData[i].employeeName
		    	 			}
		    	 		}
		    	 	}
	    	 	}
	    	 	console.log(key);
				console.log(data, $scope.ClonedcontractDetail.data[key]);
	        	if(!angular.equals(data,$scope.ClonedcontractDetail.data[key]))
	        		$scope.needToSave = true;
				
         	 }
	         	
        	 
         });

        
		 if($scope.needToSave)
		 {
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
			 $scope.disabledSave = true;
			 
 			$scope.contractDetail.data.activityData = $scope.filterActivityList;
			$scope.contractDetail.data.assignedData = $scope.filterPeopleList;


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
				 $scope.isError = false; // reset error flag true
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
				 $scope.disabledSave = true;
				 $scope.isUpdateError = true;
				 $scope.reformatData();
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
		   else
		   {

		   		$scope.reformatData();
		   		
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
				
			 	 if ($scope.cookContractId){
						$cookieStore.put("detailId",$scope.customerID);
						$rootScope.deleteCustomerContract = true;
						$location.path('/CustomerDetail');
	 			}
				else{
					$rootScope.localCache.isContractAPINeeded = true;
					$location.path('/Contract');
				 }
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

