/**
 * customerDetailController - Controller of the Customer Detail page
 * @param $scope
 * @param USDateFormat
 * @param $rootScope
 * @param $timeout
 * @param $modal
 * @param $http
 * @param $location
 * @param $cookieStore
 * @param $filter
 * @param $anchorScroll
 * @param fileReader
 * @param CurrentTimeStamp
 * @param $interval
 * @param FilterDeleted
 */
function customerDetailController($scope, USDateFormat, $rootScope, $timeout, $modal, $http, $location, $cookieStore, $filter, $anchorScroll, fileReader, CurrentTimeStamp, $interval, FilterDeleted) {
    $rootScope.manage = true;
    $rootScope.selectedMenu = 'Customer'; //Rootscope variables used to select the Accordion menus.	
    $scope.companycollapseTable = false;
    $scope.ClonedCustomerDetail = {}; //Object used to copy the customer detail object
    $rootScope.copyCustomerDetails = {};
    $scope.alerts = [];
    $scope.mapOptions = {};
    $scope.lastUpdated = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');
    $scope.UploadDocumentsOptionVisible = true;
    $scope.attachmentsContainerVisible = false;
    $scope.displayUpload = true;
    $scope.customerHeading = "";
    $scope.disableDelete = false;
    $scope.newCustomer = true;
    $scope.noDataAvailable = false;
    $scope.needMapCall = {
        "callMap": false
    };
    $scope.addressKeys = ["addressStreet", "addressCity", "addressStateCode", "addressPostZip", "addressISOCountry"];
    $scope.isError = false;
    $scope.isUpdateError = false;
    $scope.contractTableData = [];
    $scope.contactTableData = [];
    $scope.currentPath = $location.path();
    var activeContactList = [];
    var activeContractList = [];
    var timeInterval = '';
    $rootScope.calledFromCustomerDetail = true;

    $('select[name="colorpicker"]').simplecolorpicker({
        picker: true
    })


    if ($cookieStore.get("detailId") == null)
        $location.path('/Customer');

    var myHeaderCellTemplate = '<div class="ngHeaderSortColumn {{col.headerClass}}" ng-style="{\'cursor\': col.cursor}" ng-class="{ \'ngSorted\': !noSortVisible }">' +
        '<div ng-click="col.sort($event)" ng-class="\'colt\' + col.index" class="ngHeaderText">{{col.displayName}} <button ng-click="navigateToContractDetail()" class="btn btn-default btn-sm"><i class="fa fa-plus"></i></button></div>' +
        '<div class="ngSortButtonDown" ng-show="col.showSortButtonDown()"></div>' +
        '<div class="ngSortButtonUp" ng-show="col.showSortButtonUp()"></div>' +
        '<div class="ngSortPriority">{{col.sortPriority}}</div>' +
        '<div ng-class="{ ngPinnedIcon: col.pinned, ngUnPinnedIcon: !col.pinned }" ng-click="togglePin(col)" ng-show="col.pinnable"></div>' +
        '</div>' +
        '<div ng-show="col.resizable" class="ngHeaderGrip" ng-click="col.gripClick($event)" ng-mousedown="col.gripOnMouseDown($event)"></div>';

    var contactHeaderCell = '<div class="ngHeaderSortColumn {{col.headerClass}}" ng-style="{\'cursor\': col.cursor}" ng-class="{ \'ngSorted\': !noSortVisible }">' +
        '<div ng-click="col.sort($event)" ng-class="\'colt\' + col.index" class="ngHeaderText">{{col.displayName}} <button ng-click="openContactInfo()" class="btn btn-default btn-sm"><i class="fa fa-plus"></i></button></div>' +
        '<div class="ngSortButtonDown" ng-show="col.showSortButtonDown()"></div>' +
        '<div class="ngSortButtonUp" ng-show="col.showSortButtonUp()"></div>' +
        '<div class="ngSortPriority">{{col.sortPriority}}</div>' +
        '<div ng-class="{ ngPinnedIcon: col.pinned, ngUnPinnedIcon: !col.pinned }" ng-click="togglePin(col)" ng-show="col.pinnable"></div>' +
        '</div>' +
        '<div ng-show="col.resizable" class="ngHeaderGrip" ng-click="col.gripClick($event)" ng-mousedown="col.gripOnMouseDown($event)"></div>';

    
    /**
     * ========================================================================================================
     * Function Used to map the country code to the country name during GET and POST.
     * ========================================================================================================
     */
    $scope.formatInputData = function() {
        if ($scope.CustomerDetail != null) {
            if ($scope.CustomerDetail.data.addressISOCountry != null) {
                if ($scope.countries != null) {
                    angular.forEach($scope.countries, function(data, key) {
                        if (data.code == $scope.CustomerDetail.data.addressISOCountry)
                            $scope.CustomerDetail.data.addressISOCountry = data;
                    });
                }
            }
        }
        if ($scope.CustomerDetail != null) {
            if ($scope.CustomerDetail.data.addressStateCode != null) {
                if ($scope.states != null) {
                    angular.forEach($scope.states, function(data, key) {
                        if (data.code == $scope.CustomerDetail.data.addressStateCode)
                            $scope.CustomerDetail.data.addressStateCode = data;
                    });
                }
            }

        }

    }

    /**
     * ======================================================
     *  API call to get the Country names
     *  =====================================================
     */
    if ($rootScope.localCache.countries == null) {
        $http.get('/api/listData/countries').success(function(data) {
            $scope.countries = data.data;
            $rootScope.localCache.countries = $scope.countries;
            $scope.formatInputData();
        }).error(function(data, status) {
            //Code used for local testing and it should be removed finally.
            $scope.countriesJson            = {"success":true,"total":1,"data":[{"name":"Ascension Island","code":"AC"},{"name":"Andorra","code":"AD"},{"name":"United Arab Emirates","code":"AE"},{"name":"Afghanistan","code":"AF"},{"name":"Antigua And Barbuda","code":"AG"},{"name":"Anguilla","code":"AI"},{"name":"Albania","code":"AL"},{"name":"Armenia","code":"AM"},{"name":"Angola","code":"AO"},{"name":"Antarctica","code":"AQ"},{"name":"Argentina","code":"AR"},{"name":"American Samoa","code":"AS"},{"name":"Austria","code":"AT"},{"name":"Australia","code":"AU"},{"name":"Aruba","code":"AW"},{"name":"Azerbaijan","code":"AZ"},{"name":"Bosnia & Herzegovina","code":"BA"},{"name":"Barbados","code":"BB"},{"name":"Bangladesh","code":"BD"},{"name":"Belgium","code":"BE"},{"name":"Burkina Faso","code":"BF"},{"name":"Bulgaria","code":"BG"},{"name":"Bahrain","code":"BH"},{"name":"Burundi","code":"BI"},{"name":"Benin","code":"BJ"},{"name":"Bermuda","code":"BM"},{"name":"Brunei Darussalam","code":"BN"},{"name":"Bolivia, Plurinational State Of","code":"BO"},{"name":"Afghanistan","code":"AF"},{"name":"Antigua And Barbuda","code":"AG"},{"name":"Anguilla","code":"AI"},{"name":"Albania","code":"AL"},{"name":"Armenia","code":"AM"},{"name":"Angola","code":"AO"},{"name":"Antarctica","code":"AQ"},{"name":"Argentina","code":"AR"},{"name":"American Samoa","code":"AS"},{"name":"Austria","code":"AT"},{"name":"Australia","code":"AU"},{"name":"Aruba","code":"AW"},{"name":"Azerbaijan","code":"AZ"},{"name":"Bosnia & Herzegovina","code":"BA"},{"name":"Barbados","code":"BB"},{"name":"Bangladesh","code":"BD"},{"name":"Belgium","code":"BE"},{"name":"Burkina Faso","code":"BF"},{"name":"Bulgaria","code":"BG"},{"name":"Bahrain","code":"BH"},{"name":"Burundi","code":"BI"},{"name":"Benin","code":"BJ"},{"name":"Bermuda","code":"BM"},{"name":"Brunei Darussalam","code":"BN"},{"name":"Bolivia, Plurinational State Of","code":"BO"},{"name":"Bonaire, Saint Eustatius And Saba","code":"BQ"},{"name":"Brazil","code":"BR"},{"name":"Bahamas","code":"BS"},{"name":"Bhutan","code":"BT"},{"name":"Bouvet Island","code":"BV"},{"name":"Botswana","code":"BW"},{"name":"Belarus","code":"BY"},{"name":"Belize","code":"BZ"},{"name":"Canada","code":"CA"},{"name":"Cocos (Keeling) Islands","code":"CC"},{"name":"Democratic Republic Of Congo","code":"CD"},{"name":"Central African Republic","code":"CF"},{"name":"Republic Of Congo","code":"CG"},{"name":"Switzerland","code":"CH"},{"name":"Cote d'Ivoire","code":"CI"},{"name":"Cook Islands","code":"CK"},{"name":"Chile","code":"CL"},{"name":"Cameroon","code":"CM"},{"name":"China","code":"CN"},{"name":"Colombia","code":"CO"},{"name":"Clipperton Island","code":"CP"},{"name":"Costa Rica","code":"CR"},{"name":"Cuba","code":"CU"},{"name":"Cape Verde","code":"CV"},{"name":"Curacao","code":"CW"},{"name":"Christmas Island","code":"CX"},{"name":"Cyprus","code":"CY"},{"name":"Czech Republic","code":"CZ"},{"name":"Germany","code":"DE"},{"name":"Diego Garcia","code":"DG"},{"name":"Djibouti","code":"DJ"},{"name":"Denmark","code":"DK"},{"name":"Dominica","code":"DM"},{"name":"Dominican Republic","code":"DO"},{"name":"Algeria","code":"DZ"},{"name":"Ceuta, Mulilla","code":"EA"},{"name":"Ecuador","code":"EC"},{"name":"Estonia","code":"EE"},{"name":"Egypt","code":"EG"},{"name":"Western Sahara","code":"EH"},{"name":"Eritrea","code":"ER"},{"name":"Spain","code":"ES"},{"name":"Ethiopia","code":"ET"},{"name":"European Union","code":"EU"},{"name":"Finland","code":"FI"},{"name":"Fiji","code":"FJ"},{"name":"Falkland Islands","code":"FK"},{"name":"Micronesia, Federated States Of","code":"FM"},{"name":"Faroe Islands","code":"FO"},{"name":"France","code":"FR"},{"name":"France, Metropolitan","code":"FX"},{"name":"Gabon","code":"GA"},{"name":"United Kingdom","code":"GB"},{"name":"Grenada","code":"GD"},{"name":"Georgia","code":"GE"},{"name":"French Guiana","code":"GF"},{"name":"Guernsey","code":"GG"},{"name":"Ghana","code":"GH"},{"name":"Gibraltar","code":"GI"},{"name":"Greenland","code":"GL"},{"name":"Gambia","code":"GM"},{"name":"Great Britain","code":"GB"},{"name":"Guinea","code":"GN"},{"name":"Guadeloupe","code":"GP"},{"name":"Equatorial Guinea","code":"GQ"},{"name":"Greece","code":"GR"},{"name":"South Georgia And The South Sandwich Islands","code":"GS"},{"name":"Guatemala","code":"GT"},{"name":"Guam","code":"GU"},{"name":"Guinea-bissau","code":"GW"},{"name":"Guyana","code":"GY"},{"name":"Hong Kong","code":"HK"},{"name":"Heard Island And McDonald Islands","code":"HM"},{"name":"Honduras","code":"HN"},{"name":"Croatia","code":"HR"},{"name":"Haiti","code":"HT"},{"name":"Hungary","code":"HU"},{"name":"Canary Islands","code":"IC"},{"name":"Indonesia","code":"ID"},{"name":"Ireland","code":"IE"},{"name":"Israel","code":"IL"},{"name":"Isle Of Man","code":"IM"},{"name":"India","code":"IN"},{"name":"British Indian Ocean Territory","code":"IO"},{"name":"Iraq","code":"IQ"},{"name":"Iran, Islamic Republic Of","code":"IR"},{"name":"Iceland","code":"IS"},{"name":"Italy","code":"IT"},{"name":"Jersey","code":"JE"},{"name":"Jamaica","code":"JM"},{"name":"Jordan","code":"JO"},{"name":"Japan","code":"JP"},{"name":"Kenya","code":"KE"},{"name":"Kyrgyzstan","code":"KG"},{"name":"Cambodia","code":"KH"},{"name":"Kiribati","code":"KI"},{"name":"Comoros","code":"KM"},{"name":"Saint Kitts And Nevis","code":"KN"},{"name":"Korea, Democratic People's Republic Of","code":"KP"},{"name":"Korea, Republic Of","code":"KR"},{"name":"Kuwait","code":"KW"},{"name":"Cayman Islands","code":"KY"},{"name":"Kazakhstan","code":"KZ"},{"name":"Lao People's Democratic Republic","code":"LA"},{"name":"Lebanon","code":"LB"},{"name":"Saint Lucia","code":"LC"},{"name":"Liechtenstein","code":"LI"},{"name":"Sri Lanka","code":"LK"},{"name":"Liberia","code":"LR"},{"name":"Lesotho","code":"LS"},{"name":"Lithuania","code":"LT"},{"name":"Luxembourg","code":"LU"},{"name":"Latvia","code":"LV"},{"name":"Libya","code":"LY"},{"name":"Morocco","code":"MA"},{"name":"Monaco","code":"MC"},{"name":"Moldova","code":"MD"},{"name":"Montenegro","code":"ME"},{"name":"Saint Martin","code":"MF"},{"name":"Madagascar","code":"MG"},{"name":"Marshall Islands","code":"MH"},{"name":"Macedonia, The Former Yugoslav Republic Of","code":"MK"},{"name":"Mali","code":"ML"},{"name":"Myanmar","code":"MM"},{"name":"Mongolia","code":"MN"},{"name":"Macao","code":"MO"},{"name":"Northern Mariana Islands","code":"MP"},{"name":"Martinique","code":"MQ"},{"name":"Mauritania","code":"MR"},{"name":"Montserrat","code":"MS"},{"name":"Malta","code":"MT"},{"name":"Mauritius","code":"MU"},{"name":"Maldives","code":"MV"},{"name":"Malawi","code":"MW"},{"name":"Mexico","code":"MX"},{"name":"Malaysia","code":"MY"},{"name":"Mozambique","code":"MZ"},{"name":"Namibia","code":"NA"},{"name":"New Caledonia","code":"NC"},{"name":"Niger","code":"NE"},{"name":"Norfolk Island","code":"NF"},{"name":"Nigeria","code":"NG"},{"name":"Nicaragua","code":"NI"},{"name":"Netherlands","code":"NL"},{"name":"Norway","code":"NO"},{"name":"Nepal","code":"NP"},{"name":"Nauru","code":"NR"},{"name":"Niue","code":"NU"},{"name":"New Zealand","code":"NZ"},{"name":"Oman","code":"OM"},{"name":"Panama","code":"PA"},{"name":"Peru","code":"PE"},{"name":"French Polynesia","code":"PF"},{"name":"Papua New Guinea","code":"PG"},{"name":"Philippines","code":"PH"},{"name":"Pakistan","code":"PK"},{"name":"Poland","code":"PL"},{"name":"Saint Pierre And Miquelon","code":"PM"},{"name":"Pitcairn","code":"PN"},{"name":"Puerto Rico","code":"PR"},{"name":"Palestinian Territory, Occupied","code":"PS"},{"name":"Portugal","code":"PT"},{"name":"Palau","code":"PW"},{"name":"Paraguay","code":"PY"},{"name":"Qatar","code":"QA"},{"name":"Reunion","code":"RE"},{"name":"Romania","code":"RO"},{"name":"Serbia","code":"RS"},{"name":"Russian Federation","code":"RU"},{"name":"Rwanda","code":"RW"},{"name":"Saudi Arabia","code":"SA"},{"name":"Solomon Islands","code":"SB"},{"name":"Seychelles","code":"SC"},{"name":"Sudan","code":"SD"},{"name":"Sweden","code":"SE"},{"name":"Singapore","code":"SG"},{"name":"Saint Helena, Ascension And Tristan Da Cunha","code":"SH"},{"name":"Slovenia","code":"SI"},{"name":"Svalbard And Jan Mayen","code":"SJ"},{"name":"Slovakia","code":"SK"},{"name":"Sierra Leone","code":"SL"},{"name":"San Marino","code":"SM"},{"name":"Senegal","code":"SN"},{"name":"Somalia","code":"SO"},{"name":"Suriname","code":"SR"},{"name":"South Sudan","code":"SS"},{"name":"SÃŒÂ£o TomÃŒÂ© and PrÃŒ_ncipe","code":"ST"},{"name":"USSR","code":"SU"},{"name":"El Salvador","code":"SV"},{"name":"Sint Maarten","code":"SX"},{"name":"Syrian Arab Republic","code":"SY"},{"name":"Swaziland","code":"SZ"},{"name":"Tristan de Cunha","code":"TA"},{"name":"Turks And Caicos Islands","code":"TC"},{"name":"Chad","code":"TD"},{"name":"French Southern Territories","code":"TF"},{"name":"Togo","code":"TG"},{"name":"Thailand","code":"TH"},{"name":"Tajikistan","code":"TJ"},{"name":"Tokelau","code":"TK"},{"name":"East Timor","code":"TL"},{"name":"Turkmenistan","code":"TM"},{"name":"Tunisia","code":"TN"},{"name":"Tonga","code":"TO"},{"name":"Turkey","code":"TR"},{"name":"Trinidad And Tobago","code":"TT"},{"name":"Tuvalu","code":"TV"},{"name":"Taiwan, Province Of China","code":"TW"},{"name":"Tanzania, United Republic Of","code":"TZ"},{"name":"Ukraine","code":"UA"},{"name":"Uganda","code":"UG"},{"name":"United Kingdom","code":"GB"},{"name":"United States Minor Outlying Islands","code":"UM"},{"name":"United States","code":"US"},{"name":"Uruguay","code":"UY"},{"name":"Uzbekistan","code":"UZ"},{"name":"Vatican City State","code":"VA"},{"name":"Saint Vincent And The Grenadines","code":"VC"},{"name":"Venezuela, Bolivarian Republic Of","code":"VE"},{"name":"Virgin Islands (British)","code":"VG"},{"name":"Virgin Islands (US)","code":"VI"},{"name":"Viet Nam","code":"VN"},{"name":"Vanuatu","code":"VU"},{"name":"Wallis And Futuna","code":"WF"},{"name":"Samoa","code":"WS"},{"name":"Yemen","code":"YE"},{"name":"Mayotte","code":"YT"},{"name":"South Africa","code":"ZA"},{"name":"Zambia","code":"ZM"},{"name":"Zimbabwe","code":"ZW"}]};
				$scope.countries                = $scope.countriesJson.data;
				$rootScope.localCache.countries = $scope.countries;
				$scope.formatInputData();
        });
    } else {
        $scope.countries = $rootScope.localCache.countries;
        $scope.formatInputData();
    }

    /**
     * =======================================================
     * API call to get the State names
     * =======================================================
     */
    if ($rootScope.localCache.states == null) {
        $http.get('/api/listData/states').success(function(data) {
            $scope.states = data.data;
            $rootScope.localCache.states = $scope.states;
            $scope.formatInputData();
        }).error(function(data, status) {
            //Code used for local testing and it should be removed finally.
            $scope.state_namesJson       = {"success":true,"total":1,"data":[{"name":"Alabama","code":"AL"},{"name":"Alaska","code":"AK"},{"name":"Arizona","code":"AZ"},{"name":"Arkansas","code":"AR"},{"name":"California","code":"CA"},{"name":"Colorado","code":"CO"},{"name":"Connecticut","code":"CT"},{"name":"Delaware","code":"DE"},{"name":"District of Columbia","code":"DC"},{"name":"Florida","code":"FL"},{"name":"Georgia","code":"GA"},{"name":"Hawaii","code":"HI"},{"name":"Idaho","code":"ID"},{"name":"Illinois","code":"IL"},{"name":"Indiana","code":"IN"},{"name":"Iowa","code":"IA"},{"name":"Kansa","code":"KS"},{"name":"Kentucky","code":"KY"},{"name":"Lousiana","code":"LA"},{"name":"Maine","code":"ME"},{"name":"Maryland","code":"MD"},{"name":"Massachusetts","code":"MA"},{"name":"Michigan","code":"MI"},{"name":"Minnesota","code":"MN"},{"name":"Mississippi","code":"MS"},{"name":"Missouri","code":"MO"},{"name":"Montana","code":"MT"},{"name":"Nebraska","code":"NE"},{"name":"Nevada","code":"NV"},{"name":"New Hampshire","code":"NH"},{"name":"New Jersey","code":"NJ"},{"name":"New Mexico","code":"NM"},{"name":"New York","code":"NY"},{"name":"North Carolina","code":"NC"},{"name":"North Dakota","code":"ND"},{"name":"Ohio","code":"OH"},{"name":"Oklahoma","code":"OK"},{"name":"Oregon","code":"OR"},{"name":"Pennsylvania","code":"PA"},{"name":"Rhode Island","code":"RI"},{"name":"South Carolina","code":"SC"},{"name":"South Dakota","code":"SD"},{"name":"Tennessee","code":"TN"},{"name":"Texas","code":"TX"},{"name":"Utah","code":"UT"},{"name":"Vermont","code":"VT"},{"name":"Virginia","code":"VA"},{"name":"Washington","code":"WA"},{"name":"West Virginia","code":"WV"},{"name":"Wisconsin","code":"WI"},{"name":"Wyoming","code":"WY"}]};		
				$scope.states                = $scope.state_namesJson.data;
				$rootScope.localCache.states = $scope.states;
				$scope.formatInputData();
        });
    } else {
        $scope.states = $rootScope.localCache.states;
        $scope.formatInputData();
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
						 {
							 rowObj.currency = data.code;
							 $scope.symbol = data.symbol;
						 }
						 else
						 {
							 rowObj.currency =data.code;
							 $scope.symbol = data.code;
						 }
							 
						 
					 }
				 });
    			 return $scope.symbol;
    		}
    		else
    			return '$';
    	}
    }

    
    /**
     *==========================================================================================
     *Contract table Grid info
     *===========================================================================================
     */
    $scope.contactTableoptions = {
        data: 'contactTableData',
        multiSelect: false,
        headerRowHeight: 40,
        rowHeight: 40,
        rowTemplate: '<div ng-dblclick="openContactInfo(row,row.rowIndex)" ng-style="{ \'cursor\': row.cursor }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell {{col.cellClass}}"><div class="ngVerticalBar" ng-style="{height: rowHeight}" ng-class="{ ngVerticalBarVisible: !$last }">&nbsp;</div><div ng-cell></div></div>',
        columnDefs: [{
            field: 'name',
            width: "89%",
            displayName: 'Contacts'
        }, {
            field: '',
            displayName: '',
            sortable: false,
            width: "11%",
            cellTemplate: '<div class="ngCellText"  style="text-align: center;"><button class="btn btn-default btn-sm" ng-click="deleteContactList(row,row.rowIndex)" ><i class="fa fa-times"></i></button></div>',
            headerCellTemplate: contactHeaderCell
        }]
    };
    $scope.contractTableoptions = {
        data: 'contractTableData',
        multiSelect: false,
        enableSorting: false,
        rowHeight: 45,
        headerRowHeight: 40,
        rowTemplate: '<div ng-dblclick="navigateToContractDetail(row,row.rowIndex)" ng-style="{ \'cursor\': row.cursor }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell {{col.cellClass}}"><div class="ngVerticalBar" ng-style="{height: rowHeight}" ng-class="{ ngVerticalBarVisible: !$last }">&nbsp;</div><div ng-cell></div></div>',
        columnDefs: [{
            field: 'poNumber',
            displayName: 'PO',
            width: "10%"
        }, {
            field: 'title',
            displayName: 'Description',
            width: "20%"
        }, {
            field: '',
            displayName: 'Dates',
            width: "20%",
            cellTemplate: '<div class = "ngCellText" style ="height:44px;"><span ng-bind = "row.entity.startDate"></span>-<span ng-bind = "row.entity.endDate"></span></div>'
        }, {
            field: 'value',
            displayName: 'Value',
            cellTemplate: '<div class = "ngCellText" style ="height:44px; line-height:33px; text-align:right;width:75%;display:inline-block;text-overflow:clip !important;"><span ng-bind="setCurrency(row.entity)"></span><span  ng-bind = "row.entity.value"></span> </div>',
            sortable: true,
            width: "10%"
        }, {
            field: 'managerName',
            displayName: 'Contract Manager',
            width: "20%"
        }, {
            field: '',
            displayName: '',
            sortable: false,
            width: "15%",
            cellTemplate: '<div class="ngCellText emp-icons-container commentsButton"><button class="btn" style="margin-right:5px" ng-class="{\'label-success\':row.entity.commentsExist,\'label-grey\':!row.entity.commentsExist}"><i class="fa fa-comment"></i></button><button class="btn" ng-class="{\'label-info\':row.entity.attachmentsExist,\'label-grey\':!row.entity.attachmentsExist}"> <i class="fa fa-folder-open"></i> </button></div>'
        }, {
            field: '',
            displayName: '',
            sortable: false,
            width: "5%",
            cellTemplate: '<div class="ngCellText emp-icons-container deleteButton" style="text-align: center;"><button class="btn btn-default btn-sm" ng-click="deleteContractList(row, row.rowIndex)" ><i class="fa fa-times"></i></button></div>',
            headerCellTemplate: myHeaderCellTemplate
        }, ]
    };

    /**
     * ===================================================================================
     * Function used the delete the contract list from the table.
     * @param {{Object}} obj
     * @param {{Integer}} index
     * ====================================================================================
     */
    $scope.deleteContractList = function(obj, index) {
        $rootScope.indexvalue = index;
        var deleteObj = obj.entity;
        $scope.closeAlert();
        $rootScope.showModal('/api/delete/contract/' + deleteObj.id + '?timestamp=' + CurrentTimeStamp.postTimeStamp(), 'Confirm Delete', 'Are you sure you would like to delete ' + deleteObj.title + '<span></span> ? This action can not be undone.', 'Cancel', 'Confirm');
        $scope.$watch('isPostSuccess', function(nValue, oValue) {
            if (nValue == null || (nValue == oValue))
                return;
            if ($rootScope.isPostSuccess) {
                $scope.CustomerDetail.data.contractList.splice($rootScope.indexvalue, 1);
                //$scope.CustomerDetail.data.contractIds.splice($rootScope.indexvalue, 1);                
                $scope.contractTableData = $scope.CustomerDetail.data.contractList;
            } else {
                $rootScope.addAlert('Failed to delete. ', "danger", "Error");
                //Codes used for local testing and it should be removed finally.
                
					//$scope.CustomerDetail.data.contractList.splice($rootScope.indexvalue,1);
					//$scope.CustomerDetail.data.contractIds.splice($rootScope.indexvalue,1);
					//$scope.contractTableData =$scope.CustomerDetail.data.contractList;
					
            }
            $rootScope.isPostSuccess = null;
        });

    }
    
     $scope.$watch('shiftNav', function(newVal, oldVal) {
        if (newVal != oldVal){
        	$scope.tableRebuild($scope.contactTableoptions);
        	$scope.tableRebuild($scope.contractTableoptions);
        }
            
    }, true);
    
    /**
	 * Rebuilding the table
	 **/
    $scope.tableRebuild = function(ngtable){
        ngtable.$gridServices.DomUtilityService.RebuildGrid(
			  ngtable.$gridScope,
			  ngtable.ngGrid
			  );
    }
    
    
    /**
     *==================================================
     * Deleting the seleted contact from the table.
     *==================================================
     */
    $scope.deleteContactList = function(obj, index) {
        var deleteObj = obj.entity;
        $rootScope.indexValue = index;
        $rootScope.showModal('/api/delete/contact/' + deleteObj.id + '?timestamp=' + CurrentTimeStamp.postTimeStamp(), 'Confirm Delete', 'Are you sure you would like to delete ' + deleteObj.name + '<span></span> ? This action can not be undone.', 'Cancel', 'Confirm');
        $scope.$watch('isPostSuccess', function(nValue, oValue) {
            if (nValue == null || (nValue == oValue))
                return;
            if ($rootScope.isPostSuccess) {
                //$scope.CustomerDetail.data.contactIds.splice($rootScope.indexValue, 1);
                $scope.CustomerDetail.data.contactList.splice($rootScope.indexValue, 1);
                $scope.contactTableData = $scope.CustomerDetail.data.contactList;
            } else {
                console.log("Failed to delete")
            }

            $rootScope.isPostSuccess = null;
        });

    }

    /**
     *==================================================
     * Function navigates to contract detail page
     * @param {integer} row
     * @param {integer} rowIndex
     *==================================================
     **/

    $scope.navigateToContractDetail = function(row, rowIndex) {
        $rootScope.cutomerContractCopy = {}; //Cloned copy of detail object
        angular.copy($scope.CustomerDetail, $rootScope.cutomerContractCopy, true);
        $rootScope.fromCustomer = true;
        if (row != null) {
            $cookieStore.put("contractId", row.entity.id);
            $rootScope.rowIndex = rowIndex;
        } else {
            //Cloning the current customer object 	
            $rootScope.customerName = $scope.CustomerDetail.data.customerName;
            $cookieStore.put("contractId", "create");
        }
        $location.path('/ContractDetail');
    }
    


    /**
     * =====================================================================================================
     * API Call to get the Customer Detail based on the customer id.
     * =====================================================================================================
     */
    $scope.customerDetailAPI = function()
    {
    	 if ($cookieStore.get("detailId") == 'create') {

    	        $scope.newCustomer = true;
    	        $scope.CustomerDetail = {
    	            "success": true,
    	            "total": 1,
    	            "data": {
    	                "customerId": null,
    	                "customerName": "",
    	                "contactList": [],
    	                "contactIds": [],
    	                "contractList": [],
    	                "contractIds": [],
    	                "color": "#009999"
    	            }
    	        }

    	        if ($rootScope.fromCustomer) {
    	            angular.copy($rootScope.cutomerContractCopy, $scope.CustomerDetail, true);
    	            $rootScope.fromCustomer = false;
    	            //$scope.CustomerDetail.data.contractList = FilterDeleted.filter($scope.CustomerDetail.data.contractList);
    	            //$scope.contractTableData = $scope.CustomerDetail.data.contractList;
    	            
    	           //In get we need to filter the deleted datas of the contractList
    	            var tempContractList = [];
    	            angular.forEach($scope.CustomerDetail.data.contractList,function(data,key){
    	            	if(!data.deleted)
    	            		tempContractList.push(data);
    	            }); 
    	            $scope.CustomerDetail.data.contractList = tempContractList;
    	            $scope.contractTableData =  $scope.CustomerDetail.data.contractList;
    	            
    	            
    	            $scope.CustomerDetail.data.contactList = FilterDeleted.filter($scope.CustomerDetail.data.contactList);
    	            $scope.contactTableData = $scope.CustomerDetail.data.contactList;
    	            $scope.disabledSave = false;

    	        }

    	        $scope.disableDelete = true;
    	        $scope.showEmptyContactDetail = true;
    	        $scope.mapOptions = $scope.CustomerDetail;
    	       

    	    } else {
    	        $scope.newCustomer = false;
    	        $scope.showEmptyContactDetail = true;

    	        if ($cookieStore.get("detailId") != null) {
    	            if ($rootScope.fromCustomer) {
    	                //angular.copy($rootScope.cutomerContractCopy,$scope.CustomerDetail,true);
    	                $scope.CustomerDetail = {};
    	                //angular.copy($scope.CustomerDetail, $scope.ClonedCustomerDetail, true);
    	                $scope.CustomerDetail = $rootScope.cutomerContractCopy;
    	                $scope.mapOptions = $scope.CustomerDetail;
    	                $scope.needMapCall.callMap = true;
    	                $scope.customerHeading = $scope.CustomerDetail.data.customerName;
    	                $scope.isError = false;
    	                $scope.formatInputData();
    	                $scope.newCustomer = false;
    	                $rootScope.customerName = $scope.CustomerDetail.data.customerName;
    	                $('select[name="colorpicker"]').simplecolorpicker('selectColor', $scope.CustomerDetail.data.color);
    	                $scope.CustomerDetail.data.contactList = FilterDeleted.filter($scope.CustomerDetail.data.contactList);
    	                $scope.contactTableData = $scope.CustomerDetail.data.contactList;
    	                
    	                //In get we need to filter the deleted datas of the contractList
    	                var tempContractList = [];
    	                angular.forEach($scope.CustomerDetail.data.contractList,function(data,key){
    	                	if(!data.deleted)
    	                		tempContractList.push(data);
    	                }); 
    	                $scope.CustomerDetail.data.contractList = tempContractList;
    	                $scope.contractTableData =  $scope.CustomerDetail.data.contractList;
    	                
    	                $rootScope.fromCustomer = false;
    	                $scope.disabledSave = false;

    	            } else {
    	                $http.get('/api/customerDetail/' + $cookieStore.get("detailId")).success(function(data) {

    	                    $scope.CustomerDetail = data;
    	                    
    	                    $scope.mapOptions = $scope.CustomerDetail;
    	                    $scope.needMapCall.callMap = true;
    	                    $scope.customerHeading = data.data.customerName;
    	                    $scope.isError = false;
    	                  // activeContractList = FilterDeleted.filter($scope.CustomerDetail.data.contractList);
    	                    $('select[name="colorpicker"]').simplecolorpicker('selectColor', $scope.CustomerDetail.data.color);
    	                    angular.forEach($scope.CustomerDetail.data.contractList, function(data, key) {

    	                        if (data.value != null) {
    	                            data.value = Number(data.value).toFixed(2);
    	                        }
    	                        if (data.endDate != null)
    	                            data.endDate = USDateFormat.convert(data.endDate, true);

    	                        if (data.startDate != null)
    	                            data.startDate = USDateFormat.convert(data.startDate, true);

    	                    });
    	                    $scope.CustomerDetail.data.contactList = FilterDeleted.filter($scope.CustomerDetail.data.contactList);
    	                    $scope.contactTableData = $scope.CustomerDetail.data.contactList;
    	                    
    	                   //In get we need to filter the deleted datas of the contractList
    	                    var tempContractList = [];
    	                    angular.forEach($scope.CustomerDetail.data.contractList,function(data,key){
    	                    	if(!data.deleted)
    	                    		tempContractList.push(data);
    	                    }); 
    	                    $scope.CustomerDetail.data.contractList = tempContractList;
    	                    $scope.contractTableData =  $scope.CustomerDetail.data.contractList;
    	                    $scope.tableRebuild($scope.contactTableoptions);
    	                    $scope.formatInputData();
    	                   //Clone the object before pre formatting of data.
    	                    angular.copy($scope.CustomerDetail, $scope.ClonedCustomerDetail, true);                    
    	                    console.log($scope.CustomerDetail);console.log($scope.ClonedCustomerDetail);
    	                    $scope.newCustomer = false;
    	                    $rootScope.customerName = $scope.CustomerDetail.data.customerName;                  
    	                    $rootScope.fromCustomer = false;


    	                }).error(function(data, status) {
    	                    $scope.isError = true;
    	                    $scope.addAlert("No customer details available.", "danger");
    	                    //Code used for local testing and it should be removed finally
    	                 /**
    					$scope.CustomerDetail = $rootScope.customerDetail;
    					$scope.formatInputData();
    					if ($rootScope.fromCustomer){
    					angular.copy($rootScope.cutomerContractCopy,$scope.CustomerDetail,true);

    					//$scope.CustomerDetail.data.contractList.push($scope.CustomerDetail.data.contractList);
    					}
    					angular.copy($scope.CustomerDetail,$scope.ClonedCustomerDetail,true);
    					$('.simplecolorpicker.icon').css('background-color',$scope.CustomerDetail.data.color);

    					if ($scope.CustomerDetail.data.contactList != undefined && $scope.CustomerDetail.data.contactList.length > 1)
    					{
    						for (var i=0; i< $scope.CustomerDetail.data.contactList.length;i++){
    							if (!$scope.CustomerDetail.data.contactList[i].deleted){
    								activeContactList.push($scope.CustomerDetail.data.contactList[i])
    							}
    						}
    					}
    					$scope.contactTableData = activeContactList;//$scope.CustomerDetail.data.contactList;
    					$scope.CustomerDetail.data.contractList =  [{"value":0,"poNumber":1,"startDate":"2014-05-06","endDate":"2014-06-09"},{"poNumber":2000, "value":500},{"poNumber":3,"value":80},{"poNumber":4,"value":99000}];
    					 activeContractList = $scope.CustomerDetail.data.contractList;
    					 angular.forEach(activeContractList,function(data,key){
    					 
    					 if (data.value != 0 && data.value != null){
    						 data.value =  Number(data.value).toFixed(2);
    						 }
    						 if(data.endDate != null)
    							 data.endDate = USDateFormat.convert(data.endDate,true);
    						 if(data.startDate != null)
    							 data.startDate =USDateFormat.convert(data.startDate,true);
    					 });
    					$scope.contractTableData = activeContractList;
    					$rootScope.fromCustomer = false;
    					$rootScope.fromCustomer = false;**/

    	                });
    	                $scope.disableDelete = false;
    	                $scope.disabledSave = true;
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
            $scope.customerDetailAPI();
        }).error(function(data, status) {
            //Code used for local testing and it should be removed finally.
                $scope.localcurrencies       = {"success":true,"total":1,"data":[{"code":"USD","name":"US Dollar","symbol":"$","decimals":2.0},{"code":"CAD","name":"Canadian Dollar","symbol":"C$","decimals":2.0},{"code":"MXD","name":"Mexican Dollar","symbol":"MX$","decimals":2.0},{"code":"JPY","name":"Japanese Yen","symbol":"Â¥","decimals":0.0},{"code":"GBP","name":"British Pound","symbol":"Â£","decimals":2.0},{"code":"EUR","name":"Euro","symbol":"â‚¬","decimals":2.0},{"code":"ZAR","name":"Rand","symbol":"R","decimals":2.0},{"code":"INR","name":"Rupee","symbol":"â‚¹","decimals":2.0}]}		
				$scope.currencies            = $scope.localcurrencies.data;
				$rootScope.localCache.currencies = $scope.currencies;
				$scope.customerDetailAPI();
        });
    } else {
        $scope.currencies = $rootScope.localCache.currencies;
        $scope.customerDetailAPI();
    }
   

    /**
     * ==================================================================================
     * Function used to add alert in the page
     * @param message
     * @param type
     * ==================================================================================
     */
    $scope.addAlert = function(message, type) {
        $scope.alerts = [];
        $scope.alerts.push({
            "message": message,
            "type": type
        });
        $anchorScroll();
    }

    /**
     * ==================================================================================
     * Function used to close the alerts in the page
     * ==================================================================================
     */
    $scope.closeAlert = function() {
        $scope.alerts = [];
    }

    /**
     * ===============================================================================================================
     * Validations for TypeAhead
     * @param searchArr - Source for search items
     * @param searchKey - Search key
     * @param searchArrKey - key to searched in the source object - Applicable for objects else null should be passed
     * @param alertMessage - Message to be displayed in the alert box
     * =================================================================================================================
     */
    $scope.Validatetypeahead = function(searchArr, searchKey, searchArrKey, alertMessage, type) {

        //For Arrays
        if (searchArrKey == null) {
            if (searchArr.indexOf(searchKey) == -1) {
                $scope.addAlert(alertMessage, type);
                return false;
            }
            $scope.closeAlert();
            return true;
        }

        //For Array of Objects
        var isCodepresent = false
        angular.forEach(searchArr, function(data, key) {
            if (data[searchArrKey] == searchKey)
                isCodepresent = true
        });
        if (!isCodepresent) {
            $scope.addAlert(alertMessage, type);
            return false;
        }
        $scope.closeAlert();
        return true;
    }

    /**
     * ===================================================================================
     * Function used to navigate back to the customer list page.
     * It updates the customer Detail if there is any changes in the customer detail object or
     * it will navigate back to the customer list page.
     * ===================================================================================
     */
    $scope.backtoCustomer = function() {
        if ($scope.isError || $scope.isUpdateError) {
            $rootScope.localCache.isCustomerAPINeeded = false;
            $rootScope.closeAlert();
            $location.path('/Customer');
            return
        }
        /* return to customer list without saving */
        
        $rootScope.localCache.isCustomerAPINeeded = false;
        $rootScope.closeAlert();
        $location.path('/Customer');
        
        //To Skip saving during create
        /*if (!($cookieStore.get("detailId") == 'create')) {
            if (!angular.equals($scope.ClonedCustomerDetail, $scope.CustomerDetail)) {
                if ($scope.CustomerDetail.data.customerName == "") {
                    $scope.addAlert("Enter Customer Name.", "danger");
                    $scope.isUpdateError = true; // set error flag true
                    return;
                }
                $scope.closeAlert();
                $scope.saveCustomerData();
            } else {
                if (!$rootScope.localCache.isCustomerAPINeeded) {
                    $rootScope.localCache.isCustomerAPINeeded = false;
                }
                $location.path('/Customer');
              

            }
        } else {
        	//In create mode
            $rootScope.localCache.isCustomerAPINeeded = false;
            $location.path('/Customer');
        }*/
       
    }
    /**
     * ==================================================================================
     * Function used to save the Customer details when save button is clicked
     * or when back button is clicked when there is any changes in the customer
     * detail object.
     * ==================================================================================
     *
     */
    $scope.saveCustomerData = function() {

        if ($scope.CustomerDetail.data.customerName == "") {
            $scope.addAlert("Enter Customer Name.", "danger");
            $scope.isUpdateError = true; // set error flag true
            return;
        }

        $scope.disabledSave = true;
        $scope.inSave = true;
        console.log(angular.equals($scope.ClonedCustomerDetail, $scope.CustomerDetail));
        if (!angular.equals($scope.ClonedCustomerDetail, $scope.CustomerDetail)) {
            $scope.closeAlert();
            $rootScope.localCache.isCustomerAPINeeded = true;
            //Validation for Typeahead - To prevent data which are not available in the options
            if (($scope.CustomerDetail.data.addressISOCountry != '') && ($scope.CustomerDetail.data.addressISOCountry != null))
                if ($scope.Validatetypeahead($scope.countries, $scope.CustomerDetail.data.addressISOCountry.name, "name", "Enter a valid Country Code", "danger") == false) {
                    $scope.inSave = false;
                    $scope.isUpdateError = true; // set error flag true
                    return;
                }
            if (($scope.CustomerDetail.data.addressStateCode != '') && ($scope.CustomerDetail.data.addressStateCode != null))
                if ($scope.Validatetypeahead($scope.states, $scope.CustomerDetail.data.addressStateCode.name, "name", "Enter a valid State Code", "danger") == false) {
                    $scope.inSave = false;
                    $scope.isUpdateError = true; // set error flag true
                    return;
                }

            $scope.needMapCall.callMap = true;

            $scope.CustomerDetail.data.contactIds = [];
            angular.forEach($scope.CustomerDetail.data.contactList,function(data,key){
            	$scope.CustomerDetail.data.contactIds.push(data.id);
            });
            
            $scope.CustomerDetail.data.contractIds = [];
            angular.forEach($scope.CustomerDetail.data.contractList,function(data,key){
            	$scope.CustomerDetail.data.contractIds.push(data.id);
            });
            
            if ($scope.CustomerDetail.data.addressStateCode != null)
                $scope.CustomerDetail.data.addressStateCode = $scope.CustomerDetail.data.addressStateCode.code;
            if ($scope.CustomerDetail.data.addressISOCountry != null)
                $scope.CustomerDetail.data.addressISOCountry = $scope.CustomerDetail.data.addressISOCountry.code;

            var postData = $scope.CustomerDetail.data;
            var postTime = CurrentTimeStamp.postTimeStamp()
            $http({
                "method": "post",
                "url": '/api/customerDetail/update?timestamp=' + postTime,
                "data": postData,
                "headers": {
                    "content-type": "application/json"
                }
            }).success(function(data) {
                $scope.CustomerDetail = data;
                $rootScope.localCache.isCustomerAPINeeded = true;
                $rootScope.localCache.isFindCustomerAPINeeded = true;
                $scope.isError = false; // reset error flag true
                $scope.formatInputData();
                angular.copy($scope.CustomerDetail, $scope.ClonedCustomerDetail, true);
                if ($cookieStore.get("detailId") == 'create') {
                    $cookieStore.put("detailId", data.data.id);
                    $scope.newCustomer = false;
                }
                $scope.inSave = false;
                timeInterval = $timeout(function() {
                    $location.path('/Customer');
                }, 1000);
            }).error(function(data, status) {
                $scope.addAlert("Update failed", "danger");
                $rootScope.localCache.isCustomerAPINeeded = false;
                $rootScope.localCache.isFindCustomerAPINeeded = false;
                $scope.inSave = false;
                $scope.isUpdateError = true; // set error flag true
                //$scope.formatInputData();
            });
        }
    }

    /**
     * ===================================================================================
     * Function used to Delete the Customer Record
     * @param size - size of the pop up window
     * =====================================================================================
     */
    $scope.confirmDelete = function(size) {
        var customerName = $scope.CustomerDetail.data.customerName;

        $rootScope.showModal('/api/delete/customer/' + $cookieStore.get("detailId") + '?timestamp=' + CurrentTimeStamp.postTimeStamp(), 'Confirm Delete', 'Are you sure you would like to delete ' + customerName + '<span></span> ? This action can not be undone.', 'Cancel', 'Confirm');
        $scope.$watch('isPostSuccess', function(nValue, oValue) {
            if (nValue == null || (nValue == oValue))
                return;
            if ($rootScope.isPostSuccess) {
                $rootScope.localCache.isCustomerAPINeeded = true;
                $rootScope.localCache.isFindCustomerAPINeeded = true;
                $location.path('/Customer');
            } else {
                $scope.addAlert("Delete Failed.", "danger");
            }
            $rootScope.isPostSuccess = null;
        });

    }

    /**
     * ===============================================================================
     * Functions for Attachments container.
     * ===============================================================================
     */

    /**
     * Show attachments container
     */
    $scope.showUploadContainer = function() {
        $scope.UploadDocumentsOptionVisible = false;
        $scope.attachmentsContainerVisible = true;
    }
    /**
     * Hide attachments container
     */
    $scope.hideUploadContainer = function() {
        $scope.UploadDocumentsOptionVisible = true;
        $scope.attachmentsContainerVisible = false;
    }
    /**
     * ==================================================================================
     * Watcher for the Customer List object
     * ==================================================================================
     */
    $scope.inSave = false;
    $scope.$watch('CustomerDetail', function(nValue, oValue) {
        if (!$scope.inSave) {
            if (nValue != oValue) {
                if (!angular.equals($scope.ClonedCustomerDetail, $scope.CustomerDetail))
                    $scope.disabledSave = false;
                console.log('...'+angular.equals($scope.ClonedCustomerDetail, $scope.CustomerDetail));
            }
        }

    }, true);

    /**
     * ======================================================================================================
     * Function for changing the color in the color picker and assign it to the respective input element
     * ======================================================================================================
     */
    $scope.changeColor = function() {
        var colorBox = angular.element(document.querySelector('#colorBox'));
        colorBox.css({
            "background-color": $scope.pickedColor,
            "color": $scope.pickedColor
        });
    }

    /**
     * ======================================================================================================
     * Function for opening the contact modal screen.
     * ======================================================================================================
     */

    $scope.openContactInfo = function(obj, index) {
        $rootScope.contactRowIndex = index;
        angular.copy($scope.CustomerDetail, $rootScope.copyCustomerDetails, true);
        if (obj != null)
            $cookieStore.put('contactID', obj.entity.id);
        else
            $cookieStore.put('contactID', 'create');

        $scope.modalInstance = $modal.open({
            templateUrl: '/Application/Manage/CustomerDetail/ContactPopUp.html',
            controller: ContactModalController
        });

        $scope.modalInstance.result.then(function(listItem) {

            if ($cookieStore.get("contactID") == "create") {
                if ($scope.CustomerDetail.data.contactIds == null) {
                    $scope.CustomerDetail.data.contactIds = [];
                }
                if ($scope.CustomerDetail.data.contactList == null) {
                    $scope.CustomerDetail.data.contactList = [];
                }
                $scope.CustomerDetail.data.contactList.push(listItem);
                //$scope.CustomerDetail.data.contactIds.push(listItem.id);
                activeContactList = FilterDeleted.filter($scope.CustomerDetail.data.contactList);
                $scope.contactTableData = $scope.CustomerDetail.data.contactList;
            } else {
                $scope.CustomerDetail.data.contactList[$rootScope.contactRowIndex] = listItem;
                //$scope.CustomerDetail.data.contactIds[$rootScope.contactRowIndex] = listItem.id;
                $scope.CustomerDetail.data.contactList = FilterDeleted.filter($scope.CustomerDetail.data.contactList);
                $scope.contactTableData = $scope.CustomerDetail.data.contactList;
            }
            /**
             * Rebuilding the people and activity based on the new rows added
             **/
             $scope.contactTableoptions.$gridServices.DomUtilityService.RebuildGrid(
                                                $scope.contactTableoptions.$gridScope,
                                                $scope.contactTableoptions.ngGrid
                                                                                );
                                         

            $scope.modalInstance = null;

        }, function() {
            $scope.modalInstance = null;
        });
    };


    /**
     * ========================================================================================================
     * Used to destroy the modal when controller destroyed.
     * ========================================================================================================
     */
    $scope.$on("$destroy", function() {
        if ($scope.modalInstance != null) {
            $scope.modalInstance.close();
        }
        $timeout.cancel(timeInterval);

    });
}
//======================================================================================================//
/**
 * ContactModalController - Controller of the Customer Detail page
 * @param $scope
 * @param $rootScope
 * @param $modal
 * @param $http
 * @param $modalInstance
 * @param CurrentTimeStamp
 * @param $cookieStore
 * @param fileReader
 */
//======================================================================================================//
function ContactModalController($scope,$window,$rootScope, $route, $http, $modalInstance, CurrentTimeStamp, $cookieStore, fileReader) {

    $scope.noContactSelected = false;
    $scope.invalidEmail = false;
    $scope.debugMode = true;
    $scope.invalidEmail = false;
    $scope.isImageuploaded = false;
    $scope.isRequired = false;
    //$scope.isInfoRequired    = false;
    $scope.mapOptions = {};
    $scope.clonedContactObj = {};
    $scope.needMapCall = {
        "callMap": false
    };
    $scope.addressKeys = ["addressStreet", "addressCity", "addressStateCode", "addressPostZip", "addressCountryISO"];
    $scope.contactNumbers = [{
        "contactInfo": "",
        "info": ""
    }];
    $scope.custContactList = {};
    $rootScope.customerContacts = [];
    $scope.contactTypeValue = [];
    $scope.contactTypeDetails = [];
    $scope.isInfoRequired = [];
    $scope.custContactList = {};
    $scope.contactalerts= [];
    $scope.contactObj = {
        "id": "",
        "type": "",
        "companyName": "",
        "firstName": "",
        "lastName": "",
        "name": "",
        "address": "",
        "jobTitle": "",
        "deleted": ""
    }

    /**
     * Function used to add alerts in the contact table
     */
    $scope.addAlert = function(message,type,header)
    {
    	$scope.contactalerts = [];
        $scope.contactalerts.push({
            "message": message,
            "type": type,
            "header": header
        });
        $window.scrollTo(0, 0);
    }
    
    /**
     * Function used to close alerts in the close alert
     */
    $scope.closeAlert = function() {
    	$scope.contactalerts = [];
    }
    
    /**
     * =====================================================================================================
     *	Populating the table data in the contact popup
     *=======================================================================================================
     */
    var updateContactTableData = function() {

            if ($scope.contactDetail.data.contactNumbers == null || $scope.contactDetail.data.contactNumbers.length === 0) {
                $scope.contactDetail.data.contactNumbers = [];
                console.log("...");
            }

            for (var i = 0; i < $scope.contactDetail.data.contactNumbers.length; i++) {
                $scope.contactTypeDetails[i] = $scope.contactDetail.data.contactNumbers[i].details;
                $scope.contactTypeValue[i] = $scope.contactDetail.data.contactNumbers[i].type;
            }
     }
      /**
       * ====================================================================================================
       * Function used to format table data
       * ====================================================================================================
       */
    
	    $scope.formatTableData = function()
	    {
	    	if ($scope.contactDetail.data.contactNumbers.length === 0) {
	            $scope.contactDetail.data.contactNumbers = [];
	            $scope.contactDetail.data.contactNumbers.push({});
	            $scope.contactTypeValue[0] = "email";
	            $scope.contactTypeDetails[0] = "";
	        }
	    }
    
    
        /**
         * ========================================================================================================
         * Function Used to map the country code to the country name during GET and POST.
         * ========================================================================================================
         */
    $scope.formatInputData = function() {
        if ($scope.contactDetail != null) {
            if ($scope.contactDetail.data.addressCountryISO != null) {
                if ($scope.countries != null) {
                    angular.forEach($scope.countries, function(data, key) {
                        if (data.code == $scope.contactDetail.data.addressCountryISO)
                            $scope.contactDetail.data.addressCountryISO = data.name;
                    });
                }
            }
        }
        if ($scope.contactDetail != null) {
            if ($scope.contactDetail.data.addressStateCode != null) {
                if ($scope.states != null) {
                    angular.forEach($scope.states, function(data, key) {
                        if (data.code == $scope.contactDetail.data.addressStateCode)
                            $scope.contactDetail.data.addressStateCode = data.name;
                    });
                }
            }

        }

    }
   
    if ($cookieStore.get("contactID") == "create") {
        $scope.contactDetail = {
            "success": true,
            "total": 1,
            "data": {}
        }
        $scope.contactNumbers = null
        $scope.mapOptions = $scope.contactDetail;
        $scope.newContact = true;

        if ($scope.contactDetail.data.contactNumbers == null || $scope.contactDetail.data.contactNumbers.length === 0) {
            $scope.contactDetail.data.contactNumbers = [];
            $scope.contactDetail.data.contactNumbers.push({});
            $scope.contactTypeValue[0] = "email";
            $scope.contactTypeDetails[0] = "";
        }  
        
        angular.copy($scope.contactDetail, $scope.clonedContactObj, true);
    } else {
        $http.get('/api/contactDetail/' + $cookieStore.get("contactID")).success(function(data) {
            $scope.contactDetail = data;
            $scope.needMapCall.callMap = true;
            $scope.mapOptions = $scope.contactDetail;
            updateContactTableData();
            $scope.formatInputData();
            angular.copy($scope.contactDetail, $scope.clonedContactObj, true);
            console.log($scope.clonedContactObj.data.contactNumbers);
            $scope.formatTableData();
        }).error(function() {
            //Codes used for local testing and it should be removed finally.

            $scope.contactDetail=$scope.contactRemovedDetails;
 			updateContactTableData();
            angular.copy($scope.contactDetail, $scope.clonedContactObj, true);
        });
    }
    

    /**
     * =======================================================
     * API call to get the State names
     * =======================================================
     */
    if ($rootScope.localCache.states == null) {
        $http.get('/api/listData/states').success(function(data) {
            $scope.states = data.data;
            $rootScope.localCache.states = $scope.states;
            $scope.formatInputData();
        }).error(function(data, status) {
            //Codes used for local testing and it should be removed finally

            $scope.state_namesJson       = {"success":true,"total":1,"data":[{"name":"Alabama","code":"AL"},{"name":"Alaska","code":"AK"},{"name":"Arizona","code":"AZ"},{"name":"Arkansas","code":"AR"},{"name":"California","code":"CA"},{"name":"Colorado","code":"CO"},{"name":"Connecticut","code":"CT"},{"name":"Delaware","code":"DE"},{"name":"District of Columbia","code":"DC"},{"name":"Florida","code":"FL"},{"name":"Georgia","code":"GA"},{"name":"Hawaii","code":"HI"},{"name":"Idaho","code":"ID"},{"name":"Illinois","code":"IL"},{"name":"Indiana","code":"IN"},{"name":"Iowa","code":"IA"},{"name":"Kansa","code":"KS"},{"name":"Kentucky","code":"KY"},{"name":"Lousiana","code":"LA"},{"name":"Maine","code":"ME"},{"name":"Maryland","code":"MD"},{"name":"Massachusetts","code":"MA"},{"name":"Michigan","code":"MI"},{"name":"Minnesota","code":"MN"},{"name":"Mississippi","code":"MS"},{"name":"Missouri","code":"MO"},{"name":"Montana","code":"MT"},{"name":"Nebraska","code":"NE"},{"name":"Nevada","code":"NV"},{"name":"New Hampshire","code":"NH"},{"name":"New Jersey","code":"NJ"},{"name":"New Mexico","code":"NM"},{"name":"New York","code":"NY"},{"name":"North Carolina","code":"NC"},{"name":"North Dakota","code":"ND"},{"name":"Ohio","code":"OH"},{"name":"Oklahoma","code":"OK"},{"name":"Oregon","code":"OR"},{"name":"Pennsylvania","code":"PA"},{"name":"Rhode Island","code":"RI"},{"name":"South Carolina","code":"SC"},{"name":"South Dakota","code":"SD"},{"name":"Tennessee","code":"TN"},{"name":"Texas","code":"TX"},{"name":"Utah","code":"UT"},{"name":"Vermont","code":"VT"},{"name":"Virginia","code":"VA"},{"name":"Washington","code":"WA"},{"name":"West Virginia","code":"WV"},{"name":"Wisconsin","code":"WI"},{"name":"Wyoming","code":"WY"}]};		
				$scope.states                = $scope.state_namesJson.data;
				$rootScope.localCache.states = $scope.states;
				$scope.formatInputData();
        });
    } else {
        $scope.states = $rootScope.localCache.states;
        $scope.formatInputData();
    }

    /**
     * ======================================================
     *  API call to get the Country names
     *  =====================================================
     */
    if ($rootScope.localCache.countries == null) {
        $http.get('/api/listData/countries').success(function(data) {
            $scope.countries = data.data;
            $rootScope.localCache.countries = $scope.countries;
            $scope.formatInputData();
        }).error(function(data, status) {
            //Codes used for local testing and it should be removed finally

            $scope.countriesJson            = {"success":true,"total":1,"data":[{"name":"Ascension Island","code":"AC"},{"name":"Andorra","code":"AD"},{"name":"United Arab Emirates","code":"AE"},{"name":"Afghanistan","code":"AF"},{"name":"Antigua And Barbuda","code":"AG"},{"name":"Anguilla","code":"AI"},{"name":"Albania","code":"AL"},{"name":"Armenia","code":"AM"},{"name":"Angola","code":"AO"},{"name":"Antarctica","code":"AQ"},{"name":"Argentina","code":"AR"},{"name":"American Samoa","code":"AS"},{"name":"Austria","code":"AT"},{"name":"Australia","code":"AU"},{"name":"Aruba","code":"AW"},{"name":"Azerbaijan","code":"AZ"},{"name":"Bosnia & Herzegovina","code":"BA"},{"name":"Barbados","code":"BB"},{"name":"Bangladesh","code":"BD"},{"name":"Belgium","code":"BE"},{"name":"Burkina Faso","code":"BF"},{"name":"Bulgaria","code":"BG"},{"name":"Bahrain","code":"BH"},{"name":"Burundi","code":"BI"},{"name":"Benin","code":"BJ"},{"name":"Bermuda","code":"BM"},{"name":"Brunei Darussalam","code":"BN"},{"name":"Bolivia, Plurinational State Of","code":"BO"},{"name":"Afghanistan","code":"AF"},{"name":"Antigua And Barbuda","code":"AG"},{"name":"Anguilla","code":"AI"},{"name":"Albania","code":"AL"},{"name":"Armenia","code":"AM"},{"name":"Angola","code":"AO"},{"name":"Antarctica","code":"AQ"},{"name":"Argentina","code":"AR"},{"name":"American Samoa","code":"AS"},{"name":"Austria","code":"AT"},{"name":"Australia","code":"AU"},{"name":"Aruba","code":"AW"},{"name":"Azerbaijan","code":"AZ"},{"name":"Bosnia & Herzegovina","code":"BA"},{"name":"Barbados","code":"BB"},{"name":"Bangladesh","code":"BD"},{"name":"Belgium","code":"BE"},{"name":"Burkina Faso","code":"BF"},{"name":"Bulgaria","code":"BG"},{"name":"Bahrain","code":"BH"},{"name":"Burundi","code":"BI"},{"name":"Benin","code":"BJ"},{"name":"Bermuda","code":"BM"},{"name":"Brunei Darussalam","code":"BN"},{"name":"Bolivia, Plurinational State Of","code":"BO"},{"name":"Bonaire, Saint Eustatius And Saba","code":"BQ"},{"name":"Brazil","code":"BR"},{"name":"Bahamas","code":"BS"},{"name":"Bhutan","code":"BT"},{"name":"Bouvet Island","code":"BV"},{"name":"Botswana","code":"BW"},{"name":"Belarus","code":"BY"},{"name":"Belize","code":"BZ"},{"name":"Canada","code":"CA"},{"name":"Cocos (Keeling) Islands","code":"CC"},{"name":"Democratic Republic Of Congo","code":"CD"},{"name":"Central African Republic","code":"CF"},{"name":"Republic Of Congo","code":"CG"},{"name":"Switzerland","code":"CH"},{"name":"Cote d'Ivoire","code":"CI"},{"name":"Cook Islands","code":"CK"},{"name":"Chile","code":"CL"},{"name":"Cameroon","code":"CM"},{"name":"China","code":"CN"},{"name":"Colombia","code":"CO"},{"name":"Clipperton Island","code":"CP"},{"name":"Costa Rica","code":"CR"},{"name":"Cuba","code":"CU"},{"name":"Cape Verde","code":"CV"},{"name":"Curacao","code":"CW"},{"name":"Christmas Island","code":"CX"},{"name":"Cyprus","code":"CY"},{"name":"Czech Republic","code":"CZ"},{"name":"Germany","code":"DE"},{"name":"Diego Garcia","code":"DG"},{"name":"Djibouti","code":"DJ"},{"name":"Denmark","code":"DK"},{"name":"Dominica","code":"DM"},{"name":"Dominican Republic","code":"DO"},{"name":"Algeria","code":"DZ"},{"name":"Ceuta, Mulilla","code":"EA"},{"name":"Ecuador","code":"EC"},{"name":"Estonia","code":"EE"},{"name":"Egypt","code":"EG"},{"name":"Western Sahara","code":"EH"},{"name":"Eritrea","code":"ER"},{"name":"Spain","code":"ES"},{"name":"Ethiopia","code":"ET"},{"name":"European Union","code":"EU"},{"name":"Finland","code":"FI"},{"name":"Fiji","code":"FJ"},{"name":"Falkland Islands","code":"FK"},{"name":"Micronesia, Federated States Of","code":"FM"},{"name":"Faroe Islands","code":"FO"},{"name":"France","code":"FR"},{"name":"France, Metropolitan","code":"FX"},{"name":"Gabon","code":"GA"},{"name":"United Kingdom","code":"GB"},{"name":"Grenada","code":"GD"},{"name":"Georgia","code":"GE"},{"name":"French Guiana","code":"GF"},{"name":"Guernsey","code":"GG"},{"name":"Ghana","code":"GH"},{"name":"Gibraltar","code":"GI"},{"name":"Greenland","code":"GL"},{"name":"Gambia","code":"GM"},{"name":"Great Britain","code":"GB"},{"name":"Guinea","code":"GN"},{"name":"Guadeloupe","code":"GP"},{"name":"Equatorial Guinea","code":"GQ"},{"name":"Greece","code":"GR"},{"name":"South Georgia And The South Sandwich Islands","code":"GS"},{"name":"Guatemala","code":"GT"},{"name":"Guam","code":"GU"},{"name":"Guinea-bissau","code":"GW"},{"name":"Guyana","code":"GY"},{"name":"Hong Kong","code":"HK"},{"name":"Heard Island And McDonald Islands","code":"HM"},{"name":"Honduras","code":"HN"},{"name":"Croatia","code":"HR"},{"name":"Haiti","code":"HT"},{"name":"Hungary","code":"HU"},{"name":"Canary Islands","code":"IC"},{"name":"Indonesia","code":"ID"},{"name":"Ireland","code":"IE"},{"name":"Israel","code":"IL"},{"name":"Isle Of Man","code":"IM"},{"name":"India","code":"IN"},{"name":"British Indian Ocean Territory","code":"IO"},{"name":"Iraq","code":"IQ"},{"name":"Iran, Islamic Republic Of","code":"IR"},{"name":"Iceland","code":"IS"},{"name":"Italy","code":"IT"},{"name":"Jersey","code":"JE"},{"name":"Jamaica","code":"JM"},{"name":"Jordan","code":"JO"},{"name":"Japan","code":"JP"},{"name":"Kenya","code":"KE"},{"name":"Kyrgyzstan","code":"KG"},{"name":"Cambodia","code":"KH"},{"name":"Kiribati","code":"KI"},{"name":"Comoros","code":"KM"},{"name":"Saint Kitts And Nevis","code":"KN"},{"name":"Korea, Democratic People's Republic Of","code":"KP"},{"name":"Korea, Republic Of","code":"KR"},{"name":"Kuwait","code":"KW"},{"name":"Cayman Islands","code":"KY"},{"name":"Kazakhstan","code":"KZ"},{"name":"Lao People's Democratic Republic","code":"LA"},{"name":"Lebanon","code":"LB"},{"name":"Saint Lucia","code":"LC"},{"name":"Liechtenstein","code":"LI"},{"name":"Sri Lanka","code":"LK"},{"name":"Liberia","code":"LR"},{"name":"Lesotho","code":"LS"},{"name":"Lithuania","code":"LT"},{"name":"Luxembourg","code":"LU"},{"name":"Latvia","code":"LV"},{"name":"Libya","code":"LY"},{"name":"Morocco","code":"MA"},{"name":"Monaco","code":"MC"},{"name":"Moldova","code":"MD"},{"name":"Montenegro","code":"ME"},{"name":"Saint Martin","code":"MF"},{"name":"Madagascar","code":"MG"},{"name":"Marshall Islands","code":"MH"},{"name":"Macedonia, The Former Yugoslav Republic Of","code":"MK"},{"name":"Mali","code":"ML"},{"name":"Myanmar","code":"MM"},{"name":"Mongolia","code":"MN"},{"name":"Macao","code":"MO"},{"name":"Northern Mariana Islands","code":"MP"},{"name":"Martinique","code":"MQ"},{"name":"Mauritania","code":"MR"},{"name":"Montserrat","code":"MS"},{"name":"Malta","code":"MT"},{"name":"Mauritius","code":"MU"},{"name":"Maldives","code":"MV"},{"name":"Malawi","code":"MW"},{"name":"Mexico","code":"MX"},{"name":"Malaysia","code":"MY"},{"name":"Mozambique","code":"MZ"},{"name":"Namibia","code":"NA"},{"name":"New Caledonia","code":"NC"},{"name":"Niger","code":"NE"},{"name":"Norfolk Island","code":"NF"},{"name":"Nigeria","code":"NG"},{"name":"Nicaragua","code":"NI"},{"name":"Netherlands","code":"NL"},{"name":"Norway","code":"NO"},{"name":"Nepal","code":"NP"},{"name":"Nauru","code":"NR"},{"name":"Niue","code":"NU"},{"name":"New Zealand","code":"NZ"},{"name":"Oman","code":"OM"},{"name":"Panama","code":"PA"},{"name":"Peru","code":"PE"},{"name":"French Polynesia","code":"PF"},{"name":"Papua New Guinea","code":"PG"},{"name":"Philippines","code":"PH"},{"name":"Pakistan","code":"PK"},{"name":"Poland","code":"PL"},{"name":"Saint Pierre And Miquelon","code":"PM"},{"name":"Pitcairn","code":"PN"},{"name":"Puerto Rico","code":"PR"},{"name":"Palestinian Territory, Occupied","code":"PS"},{"name":"Portugal","code":"PT"},{"name":"Palau","code":"PW"},{"name":"Paraguay","code":"PY"},{"name":"Qatar","code":"QA"},{"name":"Reunion","code":"RE"},{"name":"Romania","code":"RO"},{"name":"Serbia","code":"RS"},{"name":"Russian Federation","code":"RU"},{"name":"Rwanda","code":"RW"},{"name":"Saudi Arabia","code":"SA"},{"name":"Solomon Islands","code":"SB"},{"name":"Seychelles","code":"SC"},{"name":"Sudan","code":"SD"},{"name":"Sweden","code":"SE"},{"name":"Singapore","code":"SG"},{"name":"Saint Helena, Ascension And Tristan Da Cunha","code":"SH"},{"name":"Slovenia","code":"SI"},{"name":"Svalbard And Jan Mayen","code":"SJ"},{"name":"Slovakia","code":"SK"},{"name":"Sierra Leone","code":"SL"},{"name":"San Marino","code":"SM"},{"name":"Senegal","code":"SN"},{"name":"Somalia","code":"SO"},{"name":"Suriname","code":"SR"},{"name":"South Sudan","code":"SS"},{"name":"SÃŒÂ£o TomÃŒÂ© and PrÃŒ_ncipe","code":"ST"},{"name":"USSR","code":"SU"},{"name":"El Salvador","code":"SV"},{"name":"Sint Maarten","code":"SX"},{"name":"Syrian Arab Republic","code":"SY"},{"name":"Swaziland","code":"SZ"},{"name":"Tristan de Cunha","code":"TA"},{"name":"Turks And Caicos Islands","code":"TC"},{"name":"Chad","code":"TD"},{"name":"French Southern Territories","code":"TF"},{"name":"Togo","code":"TG"},{"name":"Thailand","code":"TH"},{"name":"Tajikistan","code":"TJ"},{"name":"Tokelau","code":"TK"},{"name":"East Timor","code":"TL"},{"name":"Turkmenistan","code":"TM"},{"name":"Tunisia","code":"TN"},{"name":"Tonga","code":"TO"},{"name":"Turkey","code":"TR"},{"name":"Trinidad And Tobago","code":"TT"},{"name":"Tuvalu","code":"TV"},{"name":"Taiwan, Province Of China","code":"TW"},{"name":"Tanzania, United Republic Of","code":"TZ"},{"name":"Ukraine","code":"UA"},{"name":"Uganda","code":"UG"},{"name":"United Kingdom","code":"GB"},{"name":"United States Minor Outlying Islands","code":"UM"},{"name":"United States","code":"US"},{"name":"Uruguay","code":"UY"},{"name":"Uzbekistan","code":"UZ"},{"name":"Vatican City State","code":"VA"},{"name":"Saint Vincent And The Grenadines","code":"VC"},{"name":"Venezuela, Bolivarian Republic Of","code":"VE"},{"name":"Virgin Islands (British)","code":"VG"},{"name":"Virgin Islands (US)","code":"VI"},{"name":"Viet Nam","code":"VN"},{"name":"Vanuatu","code":"VU"},{"name":"Wallis And Futuna","code":"WF"},{"name":"Samoa","code":"WS"},{"name":"Yemen","code":"YE"},{"name":"Mayotte","code":"YT"},{"name":"South Africa","code":"ZA"},{"name":"Zambia","code":"ZM"},{"name":"Zimbabwe","code":"ZW"}]};
				$scope.countries                = $scope.countriesJson.data;
				$rootScope.localCache.countries = $scope.countries;
				$scope.formatInputData();
        });
    } else {
        $scope.countries = $rootScope.localCache.countries;
        $scope.formatInputData();
    }

    var plusHeaderCellTemplates = '<div class="ngHeaderSortColumn {{col.headerClass}}" ng-style="{\'cursor\': col.cursor}" ng-class="{ \'ngSorted\': !noSortVisible }">' +
        '<div ng-click="col.sort($event)" ng-class="\'colt\' + col.index" class="ngHeaderText">{{col.displayName}} <button class="btn btn-default btn-sm" ng-click="addRow(contactNumbers)"><i class="fa fa-plus"></i></button></div>' +
        '<div class="ngSortButtonDown" ng-show="col.showSortButtonDown()"></div>' +
        '<div class="ngSortButtonUp" ng-show="col.showSortButtonUp()"></div>' +
        '<div class="ngSortPriority">{{col.sortPriority}}</div>' +
        '<div ng-class="{ ngPinnedIcon: col.pinned, ngUnPinnedIcon: !col.pinned }" ng-click="togglePin(col)" ng-show="col.pinnable"></div>' +
        '</div>' +
        '<div ng-show="col.resizable" class="ngHeaderGrip" ng-click="col.gripClick($event)" ng-mousedown="col.gripOnMouseDown($event)"></div>';

    $scope.customerContactTableOption = {
        data: 'contactNumbers',
        multiSelect: false,
        enableSorting: false,
        rowHeight: 40,
        headerRowHeight: 40,
        columnDefs: [{
            field: 'contactType',
            displayName: 'Type',
            width: "38%",
            cellTemplate: '<div class="ngCellText" style="display: inline-flex;width: 100%;"><select  ng-options="contact as contact for contact in contactNumberTypes" ng-model ="defaultContactType.type" class="form-control"></select></div>'
        }, {
            field: 'info',
            displayName: 'Info',
            width: "50%",
            cellTemplate: '<div class="ngCellText" style="display: inline-flex;width: 100%;"><input type="text" ng-model="contractDetail.data.startDate" class="form-control"/><p ng-show ="invalidEmail" class="text-danger">Invalid email.</p> </div>'
        }, {
            field: '',
            displayName: '',
            width: "10%",
            headerCellTemplate: plusHeaderCellTemplates,
            cellTemplate: '<div class="ngCellText"><button class="btn btn-default btn-sm" ng-click="deleteSelectedRow(row.rowIndex,contactNumbers)"><i class="fa fa-times"></i></button></div>'
        }, ]
    }

    /**
     * ==================================================================
     * Functions used for contacts table
     * ==================================================================
     */
    $scope.isValidContactInfo = false;
    $scope.contactNewContact = {
        'info': ''
    };
    $scope.defaultContactType = {};

    /**
     * For deleting the selected row from contact detail tabular data
     */
    $scope.deleteEmployeeContactInfo = function(index) {
        $scope.contactDetail.data.contactNumbers.splice(index, 1);
        $scope.contactTypeDetails.splice(index, 1);
        $scope.contactTypeValue.splice(index, 1);
        if ($scope.contactDetail.data.contactNumbers.length == 0) {
            $scope.contactDetail.data.contactNumbers.push({});
            $scope.contactTypeDetails[0] = "";
            $scope.contactTypeValue[0] = "Phone";
        }
    };
    /**
     * Showing new row for accepting new contact detail from user
     */
    $scope.addEmployeeContactInfo = function() {
        var length = $scope.contactDetail.data.contactNumbers.length;
        $scope.contactDetail.data.contactNumbers.push({});
        $scope.contactTypeDetails[length] = "";
        $scope.contactTypeValue[length] = $scope.contactNumberTypes[0];
        //$scope.isInfoRequired = false;
    }
    /**
     * Hide new row of contact detail table
     */
    function updateNewContactDetail() {

        if ($scope.contactNewContact.info != '' && $scope.isValidContactInfo) {
            $scope.isValidContactInfo = false;
            //For calculating seqNo
            var seqNo = 0;
            angular.forEach($scope.contactDetail.data.contactNumbers, function(data, key) {

                if ((data.type.toLowerCase()) == ($scope.defaultContactType.type.toLowerCase()))
                ++seqNo;
            });
            if ($scope.contactDetail.data.contactNumbers == null) {
                $scope.contactDetail.data.contactNumbers = [];
            }
            $scope.contactDetail.data.contactNumbers.push({
                seq: seqNo,
                type: $scope.defaultContactType.type,
                details: $scope.contactNewContact.info
            });

            $scope.showEmptyContactDetail = false;
        }

    }



    /**
     ** Validate the contact pop up on save.
     **/
    var validateOnDone = function() {
        if ($scope.contactDetail.data.nickname == "" || $scope.contactDetail.data.nickname == null) {
            $scope.isRequired = true;
            return false;
        }
        //$scope.isRequired = false;
        if (($scope.showEmptyContactDetail) && (!validateUserContactDetail()))
            return false;

        return true;
    }

    $scope.getClass = function(info) {
        return $scope.red.checked && info.func.indexOf('red') != -1
    }
    //================================================================================================
    /**
     * ==============================================================
     * API call to get the Jobs available for the customer
     * ==============================================================
     */

    if ($rootScope.localCache.contactNumTypes == null) {
        $http.get('/api/listData/contactNumberTypes').success(function(data) {
            $scope.contactNumberTypes = data.data;
            $rootScope.localCache.contactNumTypes = $scope.contactNumberTypes;
            $scope.defaultContactType.type = $scope.contactNumberTypes[0];
        }).error(function(data, status) {
            $scope.contactNumberTypesJson = {
                "success": true,
                "total": 1,
                "data": ["Phone", "email", "Skype", "LinkedIn"]
            };
            $scope.contactNumberTypes = $scope.contactNumberTypesJson.data;
            $rootScope.localCache.contactNumTypes = $scope.contactNumberTypes;
            $scope.defaultContactType.type = $scope.contactNumberTypes[0];
        });
    } else {
        $scope.contactNumberTypes = $rootScope.localCache.contactNumTypes;
        $scope.defaultContactType.type = $scope.contactNumberTypes[0];
    }
    $scope.validateName = function() {
        if ($scope.contactDetail.data.nickname == "" || $scope.contactDetail.data.nickname == null) {
            $scope.isRequired = true;
            return;
        }
        $scope.isRequired = false;
    }

    /**
     * ==================================================================================
     * Image File Selection Function.
     * Function used to get the file and display it in the UI.
     * ==================================================================================
     */
    $scope.isImageuploaded = false;

    /**
     * Function used to get file
     * @param file
     */
    $scope.getFile = function(file) {
        $scope.file = file;
        fileReader.readAsDataUrl($scope.file, $scope)
            .then(function(result) {
                $scope.imageSrc = result;
                $scope.UploadImage();
                $scope.disabledSave = false;
                $scope.isImageuploaded = true;
            });
    };

    /**
     * Function used to format the contact object
     * @param custObj
     */
    var formatContactData = function(custObj) {
        $scope.contactObj.id = custObj.id;
        $scope.contactObj.type = custObj.type;
        $scope.contactObj.companyName = custObj.companyName;
        $scope.contactObj.firstName = custObj.firstName;
        $scope.contactObj.lastName = custObj.lastName;
        $scope.contactObj.name = custObj.nickname;
        $scope.contactObj.address = custObj.addressCity;
        $scope.contactObj.jobTitle = $scope.custContactList.jobTitle;
        $scope.contactObj.deleted = false;
        return $scope.contactObj;
    }

    /**
     * ================================================================================
     * Function used to save contact numbers with their sequence numbers
     * ===============================================================================
     */
    $scope.isInfoRequired = [];
    $scope.saveContactNumbers = function() {
        var isInvalidEmail = false;

        for (var i = 0; i < $scope.contactTypeDetails.length; i++)
            $scope.isInfoRequired[i] = false;
        for (var i = 0; i < $scope.contactTypeDetails.length; i++) {
            if ($scope.contactTypeValue[i] == "" || $scope.contactTypeValue[i] == null || $scope.contactTypeDetails[i] == "" || $scope.contactTypeDetails[i] == null)
                continue;
            if ($scope.contactTypeValue[i].toLowerCase() == "email") {
                var email_regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (!email_regex.test($scope.contactTypeDetails[i])) {
                    isInvalidEmail = true;
                    $scope.isInfoRequired[i] = true;
                    break;
                }
                $scope.isInfoRequired[i] = false;
            }
        }
        if (!isInvalidEmail) {
            $scope.contactDetail.data.contactNumbers = [];

            var emailSeq = -1;
            var phoneSeq = -1;
            var linkedinSeq = -1;
            var skypeSeq = -1;
            for (var i = 0; i < $scope.contactTypeDetails.length; i++) {
                if ($scope.contactTypeDetails[i] == "" || $scope.contactTypeValue[i] == "" || $scope.contactTypeValue[i] == null || $scope.contactTypeDetails[i] == null)
                    continue;
                if ($scope.contactTypeValue[i].toLowerCase() == "email") {
                    emailSeq++;
                    $scope.contactDetail.data.contactNumbers.push({
                        "details": $scope.contactTypeDetails[i],
                        "seq": emailSeq,
                        "type": $scope.contactTypeValue[i]
                    })
                }
                if ($scope.contactTypeValue[i].toLowerCase() == "phone") {
                    phoneSeq++;
                    $scope.contactDetail.data.contactNumbers.push({
                        "details": $scope.contactTypeDetails[i],
                        "seq": phoneSeq,
                        "type": $scope.contactTypeValue[i]
                    })
                }
                if ($scope.contactTypeValue[i].toLowerCase() == "skype") {
                    skypeSeq++;
                    $scope.contactDetail.data.contactNumbers.push({
                        "details": $scope.contactTypeDetails[i],
                        "seq": skypeSeq,
                        "type": $scope.contactTypeValue[i]
                    })
                }
                if ($scope.contactTypeValue[i].toLowerCase() == "linkedin") {
                    linkedinSeq++;
                    $scope.contactDetail.data.contactNumbers.push({
                        "details": $scope.contactTypeDetails[i],
                        "seq": linkedinSeq,
                        "type": $scope.contactTypeValue[i]
                    })
                }
            }
        }
        return isInvalidEmail;
    } //Save contact function ends


    /**
     * Function used to upload image
     * @param isCreate
     */
    $scope.UploadImage = function() {
        
        var fd = new FormData();
        fd.append('file', $scope.file);
        if ($cookieStore.get("contactID") != "create")
        	fd.append('contactId', $cookieStore.get("contactID"));
        $http.post('/api/upload/photo', fd, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        }).success(function(data, status) {
            console.log(data);
            $scope.contactDetail.data.photoId = data.data.resourceId;
            $scope.contactDetail.data.photoUrl = data.data.contentUrl;
            $scope.contactDetail.data.thumbUrl = data.data.thumbUrl;
            $scope.isImageuploaded = false;
        }).error(function(data, status) {
            $scope.isImageuploaded = false;
            if (status == 500) {
                //.....
            }
            if (status == 304) {
                //..
            }
            if (status == 413) {
                console.log("Image update failed:Image file exceeds maximum area.Please choose a file under 1MB.", "danger");
            }
        });
    }

    
    
    /**
     * ==================================================================================
     * Function is called when the done button is clicked in the contact modal
     * ==================================================================================
     */

    $scope.ok = function() {

       $scope.needToSave = false;        
       var tempClonedContactObj = {};
       if ($scope.saveContactNumbers()) 
            return;  
       
        angular.copy($scope.contactDetail, tempClonedContactObj, true);
        angular.forEach(tempClonedContactObj.data,function(data,key){   
            if(!angular.equals(data,$scope.clonedContactObj.data[key]))
                $scope.needToSave = true;
        });

        console.log($scope.needToSave);
        //To upload image if there is no change in the detail object
        if ($scope.isImageuploaded && !$scope.needToSave)
        	$scope.needToSave = true;
        
        if (!$scope.needToSave){
            $scope.cancel();
            return;
        }
         else{
                /*if ($scope.isImageuploaded && $cookieStore.get("contactID") != "create") {
                        $scope.UploadImage();
                }*/

                if ($scope.contactDetail.data.nickname == "" || $scope.contactDetail.data.nickname == null) {
                    $scope.isRequired = true;
                    return;
                }                
                
                if ($scope.contactDetail.data.addressStateCode != null) {
                    var stateCode = $scope.contactDetail.data.addressStateCode;
					console.log(stateCode);
                    if (typeof stateCode == 'object')
                        $scope.contactDetail.data.addressStateCode = stateCode.code;
				    else
					{
						if ($scope.states != null) {
							 angular.forEach($scope.states, function(data, key) {
								 if (data.name == $scope.contactDetail.data.addressStateCode)
								 {
									 //$scope.contactDetail.data.addressStateCode = data.code;
									 $scope.contactDetail.data.addressStateCode = data.code;
									 
								 }	 
							 });
						 }
					}
						
                }
                if ($scope.contactDetail.data.addressCountryISO != null) {
                    var countryCode = $scope.contactDetail.data.addressCountryISO;
                    if (typeof countryCode == 'object') {
                        $scope.contactDetail.data.addressCountryISO = countryCode.code;
                        $scope.contactDetail.data.addressCountryName = countryCode.name;
                    }
					else
					{
						
						 if ($scope.countries != null) {
							 angular.forEach($scope.countries, function(data, key) {
								 if (data.name == $scope.contactDetail.data.addressCountryISO)
								 {
									 $scope.contactDetail.data.addressCountryISO = data.code;
									 $scope.contactDetail.data.addressCountryName = data.name;
									 
								 }	 
							 });
						 }

					}
                }

                
                /**
                 * ===================================================================
                 * Validation for state code and country code
                 * ===================================================================
                 */
                var isValidState = false;
                var isValidCountry = false;
                $scope.inValidCountryCode=false;
                $scope.inValidStateCode = false;               
                if($scope.contactDetail.data.addressStateCode != "" && $scope.contactDetail.data.addressStateCode != null)
                {
                	angular.forEach($scope.states,function(data,key){
                	if(data.code == $scope.contactDetail.data.addressStateCode)
                		isValidState = true;
                	});
                	if(!isValidState)
                    {
                     	$scope.inValidStateCode = true;
                     	return;
                    }
                }      
                if($scope.contactDetail.data.addressCountryISO != "" && $scope.contactDetail.data.addressCountryISO != null)
                {
	                angular.forEach($scope.countries,function(data,key){
	                	if(data.code == $scope.contactDetail.data.addressCountryISO)
	                		isValidCountry = true;
	                });
	                if(!isValidCountry)
	                {
	                	$scope.inValidCountryCode = true;
	                	return;
	                }
                }
                
                if ($scope.contactDetail == undefined) { //
                } else {

                    $http({
                        "method": "post",
                        "url": '/api/contactDetail/update?timestamp=' + CurrentTimeStamp.postTimeStamp(),
                        "data": $scope.contactDetail.data,
                        "headers": {
                            "content-type": "application/json"
                        }
                    }).success(function(data) {
                        $scope.custContactList = data.data;
                        $scope.newContact = false;
                        /*if ($scope.isImageuploaded && $cookieStore.get("contactID") == "create") {
                            //$cookieStore.put("contactID",$scope.custContactList.id);
                            $scope.UploadImage($scope.custContactList.id);
                        }*/
                        if ($cookieStore.get("contactID") == "create") {
                            $modalInstance.close(formatContactData($scope.custContactList));
                        } else {
                            $modalInstance.close(formatContactData($scope.custContactList));
                        }

                    }).error(function(data, status) {
                        console.log("Failed");              
                    });
                }
             }        
    };
    /**
     * ==================================================================================
     * Function is called when the cancel button is clicked in the contact modal
     * ==================================================================================
     */
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

}

