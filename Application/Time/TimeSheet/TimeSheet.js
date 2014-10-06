/**
 * TimeSheetController - Controller for the Timesheet List Page
 * @param $scope
 * @param $rootScope
 * @param $location
 * @param $http
 * @param $filter
 * @param $cookieStore
 * @param $timeout
 * @param CurrentTimeStamp
 * @param USDateFormat
 * @param FilterDeleted
 */

function TimeSheetController($scope, $rootScope, $location, $http, $filter, $modal, $cookieStore, $timeout, CurrentTimeStamp, USDateFormat, FilterDeleted) {

    $scope.timeSheetListAdminMode = function() {
        if ($location.path() === "/TimeAdmin") {
            return true;
        }
        else {
            return false;
        }
    }

    //SS
    // Needs to be connected to the same employee list, which would mean the api for pulling employees should be pulled out of the employee list controller
    $scope.employeeList = [{'name':'Albert'},{'name':'Betsy'},{'name':'Carl'},{'name':'David'},{'name':'Ehrlich'}];

    //SS
    // WE NEED TO SET EMPLOYEE ID Programmatically, once we have a concept of 'login' established.
    // Until that time, we are setting the Employee ID/name here...
    $scope.employeeId = "540779f5e4b00092d4634fc3";
    $scope.employee_name = "Peter Pauls";


    //Rootscope variables used to select the Accordion menus.
    $rootScope.manage = true;
    $rootScope.selectedMenu = 'Timesheet';
    $scope.showDateSearch = true;
    
    $scope.totalServerItems = 0; //Total entries in the table - grid option
    $scope.maxSize = 3; //AngularJS Bootstrap  pager option value
    $scope.isDowloadClicked = false;
    $scope.orderByField = '';
    $scope.reverseSort = true;
    $scope.selectedData = [];
    $scope.previousSortIndex = '';
    $scope.formattedTimesheetList = [];
    $rootScope.closeAlert();
    $cookieStore.remove("timesheetId"); // was contractId
    var activeTimesheetList = [];
    $('.daterangepicker').hide();

    //Used to maintain the same filter when navigating from different page  and corresponding detail page
    // if (!$rootScope.calledFromContractDetail)
    //     $rootScope.searchData = false;
    // else
    //     $rootScope.calledFromContractDetail = false;

    // If json formatting needed when sorting the table, we should set this flag.	 
    $scope.isJsonFormattingNeeded = true;
    /**
     * =============================================================================================================
     * Sort Info Options for the ng-grid Table
     * =============================================================================================================
     */
   
    $scope.sortInfo = {
        fields: ['', '', '', '', ''],
        directions: ['']
    };

    /**
     * =====================================================================
     * Filter option for the ngGrid
     * =====================================================================
     */
    $scope.filterOptions = {
        filterText: '',
        useExternalFilter: false
    }
    /**
     * =====================================================================
     * Paging option for ng-grid
     * =====================================================================
     */
    $scope.pagingOptions = {
        pageSizes: [1, 10, 25, 50, 100],
        pageSize: 10,
        currentPage: 1
    };

    /**
     * =====================================================================
     * Function used to navigate to the Contract Detail page
     * when row in the Contract list table is double clicked.
     * @param row
     * =====================================================================
     */
    // $scope.navigateToDetail = function(row) {
    //     $rootScope.fromCustomer = false;
    //     if (row != null) {
    //         $cookieStore.put("detailId", row.entity.id);
    //     } else
    //         $cookieStore.put("detailId", "create");

    //     $location.path('/ContractDetail');
    // }

    /**
     * =====================================================================
     * Format JSON for excel sheet
     * =====================================================================
     */
    $scope.formatJSONforDownload = function() {
        if ($scope.TimesheetList == null)
            return;
        $scope.formattedTimesheetList = angular.copy($scope.TimesheetList);
    }
    
    /**
     * =========================================================================
     * Function used to set the currency
     * @param rowObj
     * =========================================================================
     */
    $scope.setCurrency = function(rowObj)
    {
    	if(rowObj != null)
    	{
    		if(rowObj.currency != null)
    		{
    			 angular.forEach($scope.currencies,function(data,key){
					 if(rowObj.currency == data.code)
					 {
						
						 if(data.symbol != null && data.symbol != '')
							 rowObj.currency = data.symbol;
						 else
							 rowObj.currency =data.code;
						 
					 }
				 });
    			 return rowObj.currency;
    		}
    		else
    			return '$';
    		
    	}
    }
    

    //SS
    // function that returns hours from seconds.
    $scope.toHours = function(seconds)
    {
        hours = Math.round(moment.duration(seconds*1000).asHours()*10)/10;
        return hours + " hours";
    }

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
    $scope.tableOptions = {
        "listData": null,
        "selectedItems": $scope.selectedData,
        "rowTemplate": '<div ng-dblclick="navigateToDetail(row)" ng-style="{ \'cursor\': row.cursor }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell {{col.cellClass}}"><div class="ngVerticalBar" ng-style="{height: rowHeight}" ng-class="{ ngVerticalBarVisible: !$last }">&nbsp;</div><div ng-cell></div></div>',
        "useExternalSorting": true,
        "rowHeight": 50,
        "sortInfo": $scope.sortInfo,
        "filterOptions": $scope.filterOptions,
        "pageOptions": $scope.pagingOptions,
        "columnDefs": [
        {
            field: '',
            displayName: 'Dates',
            width: "20%",
            sortable: false,
            cellTemplate: '<div class = "ngCellText"  style="height:50px"><span ng-bind = "row.entity.start"></span> - <span ng-bind = "row.entity.end"></span></div>'
        },
        {
            field: '',
            displayName: 'Total Hours',
            sortable: false,
            width: "15%",
            cellTemplate: '<div class="ngCellText" style="height:50px;"><span ng-bind="toHours(row.entity.totalTime)"></span></div>'
        }, 
        {
            field: '',
            displayName: 'Total Billable Hours',
            sortable: false,
            width: "15%",
            cellTemplate: '<div class = "ngCellText" style="height:50px;"><span ng-bind = "toHours(row.entity.billTime)"></span></div>'
        }, 
        {
            field: '',
            displayName: 'Total Time Off',
            sortable: false,
            width: "15%",
            cellTemplate: '<div class = "ngCellText" style="height:50px;"><span ng-bind = "toHours(row.entity.timeOff)"></span></div>'
        },  
        {
            field: '',
            displayName: 'Status',
            sortable: false,
            width: "21%",
            cellTemplate: '<label class="label" style="color:black;background-color:{{row.entity.statusColor}}">{{row.entity.statusText}}</label>'
        },
        {
            field: '',
            displayName: '',
            sortable: false,
            width: "14%",
            cellTemplate: '<div class="ngCellText emp-icons-container"><button class="btn" ng-class="{\'label-success\':row.entity.commentsExist,\'label-grey\':!row.entity.commentsExist}"><i class="fa fa-comment"></i></button><button class="btn" ng-class="{\'label-info\':row.entity.attachmentsExist,\'label-grey\':!row.entity.attachmentsExist}"> <i class="fa fa-folder-open"></i> </button></div>'
        }]
    }

    /**
     * ====================================================================================
     * Function Used to convert the ISO Date Format into mm/dd/yyyy format
     * =====================================================================================
     */
    $scope.convertDatetoUSFormat = function() {

        if (typeof $scope.TimesheetList != 'undefined') {

            for (var i = 0; i < $scope.TimesheetList.length; i++) {
                if ($scope.TimesheetList[i].start != null)
                    $scope.TimesheetList[i].start = USDateFormat.convert($scope.TimesheetList[i].start, true);

                if ($scope.TimesheetList[i].end != null)
                    $scope.TimesheetList[i].end = USDateFormat.convert($scope.TimesheetList[i].end, true);
            }

        }
    }

    
    

    /**
     * ================================================================================================
     * Getting the JSON data for the Timesheet list
     * The API for sending with timestamp is '/api/TimesheetList?timestamp=2014-05-31T09:30-0500'
     // http://54.85.124.2/api/timesheetList?employeeId=540779f5e4b00092d4634fc3&dateFrom=2014-01-01&dateTo=2014-12-31
     * ================================================================================================
     */
    $scope.TimesheetListApiCall = function(from,to) {

            path_to_results = '/api/timesheetList?employeeId='+$scope.employeeId;

            console.log("TimeSheetList - from/to - " + from + "/" + to);

            if (from && to) {
                path_to_results = path_to_results + "&dateFrom=" + from + "&dateTo=" + to;
            }

            $http.get(path_to_results).success(function(data) {
                $scope.TimesheetList = data.data;
                $rootScope.localCache.TimesheetList = $scope.TimesheetList; //Timesheet List is stored in local cache.For avoiding unwanted API calls		 
                $scope.convertDatetoUSFormat();
                activeTimesheetList = FilterDeleted.filter($scope.TimesheetList);
                angular.forEach(activeTimesheetList, function(data, key) {
                    if (data.value != null) {
                        data.value = data.value.toFixed(2);
                    }
                });
                $scope.tableOptions.listData = activeTimesheetList;
               
            }).error(function(data, status) {
                //Stub data used for local testing
                console.log("No local stub data for timesheet list.")                
             });
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
            $scope.TimesheetListApiCall();
        }).error(function(data, status) {
            //Code used for local testing and it should be removed finally.
                $scope.localcurrencies       = {"success":true,"total":1,"data":[{"code":"USD","name":"US Dollar","symbol":"$","decimals":2.0},{"code":"CAD","name":"Canadian Dollar","symbol":"C$","decimals":2.0},{"code":"MXD","name":"Mexican Dollar","symbol":"MX$","decimals":2.0},{"code":"JPY","name":"Japanese Yen","symbol":"Â¥","decimals":0.0},{"code":"GBP","name":"British Pound","symbol":"Â£","decimals":2.0},{"code":"EUR","name":"Euro","symbol":"â‚¬","decimals":2.0},{"code":"ZAR","name":"Rand","symbol":"R","decimals":2.0},{"code":"INR","name":"Rupee","symbol":"â‚¹","decimals":2.0}]}		
				$scope.currencies            = $scope.localcurrencies.data;
				$rootScope.localCache.currencies = $scope.currencies;
				$scope.TimesheetListApiCall();
        });
    } else {
        $scope.currencies = $rootScope.localCache.currencies;
        $scope.TimesheetListApiCall();
    }

    /**
     * =================================================================================
     * Function used to download the table contents in .xls format
     * ================================================================================
     */
    $scope.downloadTable = function() {
        $scope.isDowloadClicked = true;
    }


    /**	  
     * =============================================================================
     * Function used to Delete the Timesheet Record
     * @param size - size of the pop up window
     * =============================================================================
     */
    $scope.confirmDelete = function(size) {
        if ($scope.selectedData.length > 0) {
            $scope.closeAlert();
            console.log($scope.selectedData);
            $rootScope.showModal('/api/delete/timesheet/' + $scope.selectedData[0].id + '?timestamp=' + CurrentTimeStamp.postTimeStamp(), 'Confirm Delete', 'Are you sure you would like to delete timesheet for ' + $scope.selectedData[0].start + ' to ' + $scope.selectedData[0].end + '<span></span> ? This action can not be undone.', 'Cancel', 'Confirm');
            $scope.$watch('isPostSuccess', function(nValue, oValue) {
                if (nValue == null || (nValue == oValue))
                    return;
                if ($rootScope.isPostSuccess) {
                    $scope.TimesheetListApiCall();
                    $scope.selectedData.length = 0;
                } else {
                    $rootScope.addAlert('Failed to delete. ', "danger", "Error");
                }
                $rootScope.isPostSuccess = null;
            });

        } else {
            $rootScope.addAlert('Please select a Timesheet.', "warning", "Warning");
        }
    }
}
