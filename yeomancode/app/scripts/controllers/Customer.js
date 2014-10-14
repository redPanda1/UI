/**
 * customerController - Controller for the Customer List Page
 * @param $scope
 * @param $rootScope
 * @param $location
 * @param $http
 * @param $filter
 * @param $cookieStore
 * @param $timeout
 * @param CurrentTimeStamp
 */
angular.module('redPandaApp').controller('customerController', ['$scope','$rootScope','$location','$http','$filter','$modal','$cookieStore','$timeout','CurrentTimeStamp', 
	function($scope,$rootScope,$location,$http,$filter,$modal,$cookieStore,$timeout,CurrentTimeStamp){

    //Rootscope variables used to select the Accordion menus.
    $rootScope.manage = true;
    $rootScope.selectedMenu = 'Customer';
    $scope.totalServerItems = 0; //Total entries in the table - grid option
    $scope.maxSize = 3; //AngularJS Bootstrap  pager option value
    $scope.isDowloadClicked = false;
    $scope.orderByField = '';
    $scope.reverseSort = true;
    $scope.selectedData = [];
    $scope.displayWarning = false;
    $scope.alerts = [];
    $('.simplecolorpicker').hide();
    $scope.previousSortIndex = '';
    $scope.sortInfo = {
        fields: ['', '', '', '', '', '', ''],
        directions: ['']
    };
    $scope.formattedCustomerList = [];
    $scope.isJsonFormattingNeeded = true;
    $rootScope.closeAlert();
    $rootScope.calledFromEmployeeDetail = false;
    $rootScope.calledFromContractDetail = false;
    $scope.enableCustButtons = true;


    //Used to maintain the same filter when navigating from different page  and corresponding detail page
    if (!$rootScope.calledFromCustomerDetail)
        $rootScope.searchData = false;
    else
        $rootScope.calledFromCustomerDetail = false;

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
     * Function used to navigate to the Customer Detail page
     * when row in the customer list table is double clicked.
     * @param row
     * =====================================================================
     */
    $scope.navigateToDetail = function(row) {
        $rootScope.fromCustomer = false;
        if (row != null) {
            $cookieStore.put("detailId", row.entity.id);
        } else
            $cookieStore.put("detailId", "create");

        $rootScope.selectedEmpType = $cookieStore.get("detailId");
        $location.path('/CustomerDetail');
    }

    /**
     * =====================================================================
     * Format JSON for excel sheet
     * =====================================================================
     */
    $scope.formatJSONforDownload = function() {
        if ($scope.customerList == null)
            return;
        $scope.formattedCustomerList = angular.copy($scope.customerList);
    }

    /**
     * ====================================================================
     * Function used to enable the customer Buttons
     * ====================================================================
     */
     $scope.enableCustomerButtons = function()
     {
        $timeout(function(){
                $scope.enableCustButtons = false;
        },500);      
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
            field: 'customerId',
            displayName: 'ID',
            width: '20%'
        }, {
            field: 'customerName',
            displayName: 'Name',
            width: '20%'
        }, {
            field: 'customerAddress',
            displayName: 'Address',
            width: '40%'
        }, {
            field: '',
            displayName: '',
            width: '18%',
            sortable: false,
            cellTemplate: '<div class="customer-icons-container ngCellText text-center"><button class="btn" ng-class="{\'label-success\':row.entity.commentsExist,\'label-grey\':!row.entity.commentsExist}" style="margin-right:5px;"><i class="fa fa-comment"></i></button><button class="btn" ng-class="{\'label-info\':row.entity.attachmentsExist,\'label-grey\':!row.entity.attachmentsExist}"> <i class="fa fa-folder-open"></i> </button></div>'
        }]
    }
    /**
     * ================================================================================================
     * Getting the JSON data for the customer list
     * The API for sending with timestamp is '../api/customerList?timestamp=2014-05-31T09:30-0500'
     * ================================================================================================
     */
    var customerListApiCall = function() {
        if ($rootScope.localCache.customerList == null ) {
            $http.get('/api/customerList').success(function(data) {
                $rootScope.getTime = CurrentTimeStamp.postTimeStamp();
                $scope.customerList = data.data;
                $rootScope.localCache.customerList = $scope.customerList; //customer List is stored in local cache.For avoiding unwanted API calls		 
                $scope.tableOptions.listData = $scope.customerList; //Input for the ngGrid	
                $scope.enableCustomerButtons();

            }).error(function(data, status) {
                console.log("No data found for customer list");
                $scope.enableCustomerButtons();
            	//Local stub data for local testing
                /*$scope.customerList = $rootScope.customerData.data;
                $scope.tableOptions.listData = $scope.customerList; //Input for the ngGrid
                $rootScope.localCache.customerList = $scope.customerList;
                //$scope.tableOptions.sortBy('customerId');
                if (status == 304) {}*/
            });
        } 
        else
         {
             console.log('In else part');
             //For getting the employee list after some particular time 
             if($rootScope.localCache.isCustomerAPINeeded == true)
             {
                console.log('In timestamp');                
                /**
                *==========================================================================================
                *  API call for getting newly created and edited employees list
                *==========================================================================================
                */
                 $http.get('/api/customerList?timestamp='+ $rootScope.getTime+'&deleted=true').success(function (data) {    
                     $rootScope.getTime = CurrentTimeStamp.postTimeStamp();
                    
                     if($rootScope.selectedEmpType == 'create')
                     {
                         console.log('In create');
                        //For Create
                         for(var i=0; i<data.data.length;i++)
                         {
                             $rootScope.localCache.customerList.push(data.data[i]);
                             $scope.customerList = $rootScope.localCache.customerList;
                             
                         }
                     }
                     else
                     {
                         //For Looping through the data coming from the server.If more than one data is coming from the 
                         //timestamp api.
                         
                         for(var j=0; j< data.data.length; j++)
                         {
                             //For looping through the local cache value
                             for(var i=0; i<$rootScope.localCache.customerList.length; i++)
                             {
                                 if($rootScope.localCache.customerList[i].id == data.data[j].id)
                                 {
                                     if(data.data[j].deleted)
                                     {
                                         $rootScope.localCache.customerList.splice(i,1);
                                         $scope.customerList = $rootScope.localCache.customerList;
                                     }
                                     else
                                     {
                                         $rootScope.localCache.customerList[i] = data.data[j];
                                         $scope.customerList = $rootScope.localCache.customerList;
                                     }
                                     
                                 }
                             }
                         }
                        
                     }
                     $rootScope.selectedEmpType = null;                   
                     $scope.tableOptions.listData = $rootScope.localCache.customerList;  //Input for the ngGrid
                     $scope.enableCustomerButtons();
                      
                 }).error(function(data, status){
                       if(status == 304)
                       {
                           $scope.customerList = $rootScope.localCache.customerList;
                           $scope.tableOptions.listData = $scope.customerList;
                       }  
                       
                 });                 
                 $rootScope.localCache.isEmpAPINeeded = false;
             }
             else
             {
                
                $scope.customerList = $rootScope.localCache.customerList;
                $scope.tableOptions.listData = $scope.customerList;
                $scope.enableCustomerButtons();
             }
             
         }
    }

    customerListApiCall();

    /**
     * ==========================================================================
     * Whenever user clicks on 'Download' button
     * setting the flag as true for generating excel sheet
     * ==========================================================================
     */
    $scope.generateReport = function() {
        $scope.isDowloadClicked = true;
    }

    /**	  
     * Function used to Delete the Customer Record
     * @param size - size of the pop up window
     */
    $scope.confirmDelete = function(size) {
        if ($scope.selectedData.length > 0) {
            $scope.closeAlert();
            $scope.displayWarning = false;
            var customerId = $scope.selectedData[0].customerId
            var id = $scope.selectedData[0].id
            var customerName = $scope.selectedData[0].customerName;
            $rootScope.showModal('/api/delete/customer/' + id + '?timestamp=' + CurrentTimeStamp.postTimeStamp(), 'Confirm Delete', 'Are you sure you would like to delete ' + customerName + '? This action can not be undone.', 'Cancel', 'Confirm');
            $scope.$watch('isPostSuccess', function(nValue, oValue) {
                if (nValue == null || (nValue == oValue))
                    return;
                if ($rootScope.isPostSuccess) {
                    $rootScope.localCache.isCustomerAPINeeded = true;
                    customerListApiCall();
                    $rootScope.localCache.isFindCustomerAPINeeded = true;
                    $scope.selectedData.length = 0;
                } else {
                    $scope.addAlert('Failed to delete. ', "danger", "Error");
                }
                $rootScope.isPostSuccess = null;
            });

        } else {
            $scope.addAlert('Please select a customer.', "warning", "Warning");
        }
    }


    /**
     * Function used to add alerts in the screen.
     * @param {String} message
     * @param {String} type
     * @param {String} header
     */
    $scope.addAlert = function(message, type, header) {
        $scope.alerts = [];
        $scope.alerts.push({
            "message": message,
            "type": type,
            "header": header
        });
    }

    /**
     * Function used to close all the alerts in the screen.
     */
    $scope.closeAlert = function() {
        $scope.alerts = [];
    }

}]);
