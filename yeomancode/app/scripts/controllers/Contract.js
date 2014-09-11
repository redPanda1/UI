/**
 * ContractController - Controller for the Contract List Page
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
angular.module('redPandaApp').controller('ContractController', ['$scope','$rootScope','$location','$http','$filter','$modal','$cookieStore','$timeout','CurrentTimeStamp','FilterDeleted','USDateFormat', function($scope,$rootScope,$location,$http,$filter,$modal,$cookieStore,$timeout,CurrentTimeStamp,FilterDeleted,USDateFormat)
{
    //Rootscope variables used to select the Accordion menus.
    $rootScope.manage = true;
    $rootScope.selectedMenu = 'Contract';
    $scope.totalServerItems = 0; //Total entries in the table - grid option
    $scope.maxSize = 3; //AngularJS Bootstrap  pager option value
    $scope.isDowloadClicked = false;
    $scope.orderByField = '';
    $scope.reverseSort = true;
    $scope.selectedData = [];
    $scope.previousSortIndex = '';
    $scope.formattedContractList = [];
    $rootScope.closeAlert();
    $cookieStore.remove("contractId");
    var activeContractList = [];
    $('.daterangepicker').hide();

    //Used to maintain the same filter when navigating from different page  and corresponding detail page
    if (!$rootScope.calledFromContractDetail)
        $rootScope.searchData = false;
    else
        $rootScope.calledFromContractDetail = false;

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
    $scope.navigateToDetail = function(row) {
        $rootScope.fromCustomer = false;
        if (row != null) {
            $cookieStore.put("detailId", row.entity.id);
        } else
            $cookieStore.put("detailId", "create");

        $location.path('/ContractDetail');
    }

    /**
     * =====================================================================
     * Format JSON for excel sheet
     * =====================================================================
     */
    $scope.formatJSONforDownload = function() {
        if ($scope.ContractList == null)
            return;
        $scope.formattedContractList = angular.copy($scope.ContractList);
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
        "columnDefs": [{
            field: 'customerName',
            displayName: 'Customer',
            width: "15%"
        }, {
            field: 'poNumber',
            displayName: 'PO',
            width: "12%"
        }, {
            field: 'title',
            displayName: 'Description',
            width: "20%"
        }, {
            field: '',
            displayName: 'Duration',
            width: "18%",
            sortable: false,
            cellTemplate: '<div class = "ngCellText"  style="height:50px"><span ng-bind = "row.entity.startDate"></span>-<span ng-bind = "row.entity.endDate"></span></div>'
        }, {
            field: 'value',
            displayName: 'Value',
            cellTemplate: '<div class = "ngCellText" style="display:inline-block;width:75%;text-align:right;height:50px;line-height:40px;"> <span ng-if="row.entity.currency==\'USD\' || row.entity.currency == null">{{\'&#36;\'}}</span><span ng-if="row.entity.currency==\'GBP\'">{{\'&#xa3;\'}}</span><span ng-if="row.entity.currency==\'EUR\'">{{\'&#x80;\'}}</span><span ng-if="row.entity.currency==\'JPY\'">{{\'&#xa5;\'}}</span><span ng-bind = "row.entity.value"></span> </div>',
            sortable: true,
            width: "10%"
        }, {
            field: 'managerName',
            displayName: 'Manager',
            width: "10%"
        }, {
            field: '',
            displayName: '',
            sortable: false,
            width: "13%",
            cellTemplate: '<div class="ngCellText contract-icons-container"><button class="btn" ng-class="{\'label-success\':row.entity.commentsExist,\'label-grey\':!row.entity.commentsExist}" style="margin-right:5px;"><i class="fa fa-comment"></i></button><button class="btn" ng-class="{\'label-info\':row.entity.attachmentsExist,\'label-grey\':!row.entity.attachmentsExist}"> <i class="fa fa-folder-open"></i> </button></div>'
        }]
    }

    /**
     * ====================================================================================
     * Function Used to convert the ISO Date Format into mm/dd/yyyy format
     * =====================================================================================
     */
    $scope.convertDatetoUSFormat = function() {
        for (var i = 0; i < $scope.ContractList.length; i++) {
            if ($scope.ContractList[i].startDate != null)
                $scope.ContractList[i].startDate = USDateFormat.convert($scope.ContractList[i].startDate, true);

            if ($scope.ContractList[i].endDate != null)
                $scope.ContractList[i].endDate = USDateFormat.convert($scope.ContractList[i].endDate, true);
        }
    }



    /**
     * ================================================================================================
     * Getting the JSON data for the Contract list
     * The API for sending with timestamp is '/api/ContractList?timestamp=2014-05-31T09:30-0500'
     * ================================================================================================
     */
    var ContractListApiCall = function() {
        if ($rootScope.localCache.ContractList == null || $rootScope.localCache.isContractAPINeeded == true) {
            $http.get('/api/contractList').success(function(data) {
                $scope.ContractList = data.data;
                $rootScope.localCache.ContractList = $scope.ContractList; //Contract List is stored in local cache.For avoiding unwanted API calls		 
                $scope.convertDatetoUSFormat();
                activeContractList = FilterDeleted.filter($scope.ContractList);
                angular.forEach(activeContractList, function(data, key) {
                    if (data.value != null) {
                        data.value = data.value.toFixed(2);
                    }
                });
                $scope.tableOptions.listData = activeContractList;
               
            }).error(function(data, status) {
                //Stub data used for local testing
                
			   $scope.ContractList  = $rootScope.ContractData.data;
			   $scope.convertDatetoUSFormat();
   			   activeContractList = FilterDeleted.filter($scope.ContractList);
   			 angular.forEach(activeContractList,function(data,key){
				 if (data.value != 0 && data.value != null){
					 data.value =  data.value.toFixed(2); 
				 }
			 });
              $scope.tableOptions.listData     = activeContractList;
		 	 
		 	   $rootScope.localCache.ContractList =  $scope.ContractList;
                if (status == 304) {}
            });
        } else {
            $scope.ContractList = $rootScope.localCache.ContractList;
            $scope.convertDatetoUSFormat();
            activeContractList = FilterDeleted.filter($scope.ContractList);
            angular.forEach(activeContractList, function(data, key) {
                if (data.value != null) {
                    data.value = Number(data.value).toFixed(2);
                }
            });
            $scope.tableOptions.listData = activeContractList;
           
        }
    }

    ContractListApiCall();

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
     * Function used to Delete the Contract Record
     * @param size - size of the pop up window
     * =============================================================================
     */
    $scope.confirmDelete = function(size) {
        if ($scope.selectedData.length > 0) {
            $scope.closeAlert();
            $rootScope.showModal('/api/delete/contract/' + $scope.selectedData[0].id + '?timestamp=' + CurrentTimeStamp.postTimeStamp(), 'Confirm Delete', 'Are you sure you would like to delete ' + $scope.selectedData[0].title + '? This action can not be undone.', 'Cancel', 'Confirm');
            $scope.$watch('isPostSuccess', function(nValue, oValue) {
                if (nValue == null || (nValue == oValue))
                    return;
                if ($rootScope.isPostSuccess) {
                    $rootScope.localCache.ContractList = null
                    ContractListApiCall();
                    $scope.selectedData.length = 0;
                } else {
                    $rootScope.addAlert('Failed to delete. ', "danger", "Error");
                }
                $rootScope.isPostSuccess = null;
            });

        } else {
            $rootScope.addAlert('Please select a Contract.', "warning", "Warning");
        }
    }
}]);

