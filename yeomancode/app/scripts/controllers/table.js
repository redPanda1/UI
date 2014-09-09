/**
 * tableController - Controller for the ng-Grid Options
 * @param $scope
 * @param $timeout
 * @param $window
 * @param $rootScope
 */
angular.module('redPandaApp').controller('tableController', ['$scope','$timeout','$window','$rootScope', function($scope,$timeout,$window,$rootScope){
    $scope.empData = [];
    $scope.ngGridTableOptions = $scope.tableOptions;

    if ($scope.ngGridTableOptions.listData == null)
        $scope.ngGridTableOptions.listData = [];
    /**
     * ===================================================================================================
     * Watcher for watching the search query in the list page
     *=====================================================================================================
     */
    $scope.$watch('ngGridTableOptions.listData', function(nValue, oValue) {
        if (nValue == null)
            return;
        if ($rootScope.searchData)
            $scope.ngGridTableOptions.filterOptions.filterText = $rootScope.searchData;
        $scope.getTableData($scope.ngGridTableOptions.pageOptions.pageSize, $scope.ngGridTableOptions.pageOptions.currentPage, $scope.ngGridTableOptions.filterOptions.filterText);
    }, true);

    /**
     * ===================================================================================================
     * Function used for rebuilding the ng-grid table
     *=====================================================================================================
     */
    $scope.rebuildTable = function() {
        $scope.tableData.$gridServices.DomUtilityService.RebuildGrid(
            $scope.tableData.$gridScope,
            $scope.tableData.ngGrid
        );
    }

    /**
     * ==========================================================================================================
     * Function used for calculating the page size and displaying the contents in the table
     * @param data
     * @param page
     * @param pageSize
     * =========================================================================================================
     */
    $scope.tableSettings = function(data, page, pageSize) {
        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
        $scope.fromshowing = (page - 1) * pageSize + 1;
        $scope.toshowing = page * pageSize;
        $scope.empData = pagedData;
        $scope.totalServerItems = data.length;
        if (!$scope.$$phase) {
            $scope.$apply();
            $scope.rebuildTable();
        }
    };

    /**
     * ===========================================================================================================
     * Function used for sending the data to the function 'tableSettings'
     * @param pageSize
     * @param page
     * @param searchText
     * ===========================================================================================================
     */
    $scope.getTableData = function(pageSize, page, searchText) {
        setTimeout(function() {
            var data;
            if (searchText) {
                largeLoad = $scope.ngGridTableOptions.listData;
                var ft = searchText.toLowerCase();
                data = largeLoad.filter(function(item) {
                    return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                });
                $scope.tableSettings(data, page, pageSize);
            } else {
                $scope.tableSettings($scope.ngGridTableOptions.listData, page, pageSize);
            }
        }, 100);
    };


    /**
     * ===========================================================================================================
     * Watcher used for watching the user selection of pages in the selection box
     * @param newVal
     * @param oldVal
     * ===========================================================================================================
     */
    $scope.$watch('ngGridTableOptions.pageOptions', function(newVal, oldVal) {
        if (newVal !== oldVal) {
            if (newVal.pageSize != oldVal.pageSize) {
                $scope.ngGridTableOptions.pageOptions.currentPage = 1;
            }
            $window.scrollTo(0, 0);
            $scope.getTableData($scope.ngGridTableOptions.pageOptions.pageSize, $scope.ngGridTableOptions.pageOptions.currentPage, $scope.ngGridTableOptions.filterOptions.filterText);
        }
    }, true);

    /*
     * ===========================================================================================================
     * Watcher used for watching the collapsing and expanding of the navigation panel.
     * ===========================================================================================================
     */

    $scope.$watch('shiftNav', function(newVal, oldVal) {
        if (newVal != oldVal)
            $scope.rebuildTable();
    }, true);
    /**
     * ===============================================================================================================
     * Watcher used for watching the search text box
     * @param newVal
     * @param oldVal
     * ===============================================================================================================
     */
    $scope.$watch('ngGridTableOptions.filterOptions', function(newVal, oldVal) {
        if (newVal != oldVal) {
            $scope.ngGridTableOptions.pageOptions.currentPage = 1;
            $rootScope.searchData = $scope.ngGridTableOptions.filterOptions.filterText;
            $scope.getTableData($scope.ngGridTableOptions.pageOptions.pageSize, $scope.ngGridTableOptions.pageOptions.currentPage, $scope.ngGridTableOptions.filterOptions.filterText);
        }

    }, true);


    /**
     * =============================================================================================================
     * Table list options
     * ng-grid options are set for the list table.
     * =============================================================================================================
     */
    $scope.tableData = {
        data: 'empData',
        rowHeight: $scope.ngGridTableOptions.rowHeight ? $scope.ngGridTableOptions.rowHeight : 57,
        multiSelect: false,
        enableRowSelection: true,
        enableSorting: true,
        showFooter: false,
        enableColumnResize: true,
        filterOptions: $scope.ngGridTableOptions.filterOptions,
        enablePaging: true,
        selectedItems: $scope.selectedData,
        totalServerItems: 'totalServerItems',
        sortInfo: $scope.ngGridTableOptions.sortInfo,
        useExternalSorting: $scope.ngGridTableOptions.useExternalSorting,
        pagingOptions: $scope.ngGridTableOptions.pageOptions,
        rowTemplate: $scope.ngGridTableOptions.rowTemplate,
        columnDefs: $scope.ngGridTableOptions.columnDefs
    };


    /**
     * ===============================================================================================================
     * Sort Function for sorting all the datas in the table
     * ==============================================================================================================
     */
    var sortData = function(field, direction) {
        if ($scope.ngGridTableOptions.listData == null)
            return;
        $scope.ngGridTableOptions.listData.sort(function(a, b) {
            var first, second;
            //Special case for the Employee table
            if (field == 'isContractor') {
                if (a[field] == null)
                    a[field] = false;
            }
            if (typeof a[field] != 'boolean') {
                if (a[field] != null) {
                    if (typeof a[field] != "number")
                        first = a[field].toLowerCase();
                    else
                        first = a[field];
                } else if (a[field] == null || (typeof a[field] == 'undefined')) {
                    first = "";
                }
                if (b[field] != null) {
                    if (typeof a[field] != "number")
                        second = b[field].toLowerCase();
                    else
                        second = b[field];
                } else if (b[field] == null || (typeof b[field] == 'undefined')) {
                    second = "";
                }
            }
            if (direction == "asc") {
                if (typeof a[field] == 'boolean') {
                    if (a[field])
                        return -1;
                    else
                        return 1;
                } else {
                    if (first > second)
                        return 1;
                    if (first < second)
                        return -1;
                }
            } else {
                if (typeof a[field] == 'boolean') {
                    if (a[field])
                        return 1;
                    else
                        return -1;
                } else {
                    if (first > second)
                        return -1;
                    if (first < second)
                        return 1;
                }
            }
        });
    }

    /**
     * ================================================================================================================
     * Watcher for Sorting all the data in the ng-grid table
     * @param newVal
     * @param oldVal
     * ================================================================================================================
     */
    $scope.$watch('ngGridTableOptions.sortInfo', function(newVal, oldVal) {
        if (newVal.fields[0] == '' && oldVal.fields[0] == '')
            return;
        sortData(newVal.fields[0], newVal.directions[0]);
    }, true);

    /**
     * ==============================================================================================================
     * Event listner for ng-grid sort and sorting accordingly for download excel
     * @param SortedColumn
     * @param event
     * ===============================================================================================================
     */
    $scope.$on('ngGridEventSorted', function(SortedColumn, event) {
        if ($scope.isJsonFormattingNeeded == null)
            return
        if ($scope.isJsonFormattingNeeded)
            $scope.formatJSONforDownload();
    });

}]);
