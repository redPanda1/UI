/**
 * employeeDetailController - Controller of the Employee Detail page
 * @param $scope
 * @param USDateFormat
 * @param IsoDateFormat
 * @param $rootScope
 * @param $modal
 * @param $http
 * @param $location
 * @param $cookieStore
 * @param $filter
 * @param fileReader
 * @param $window
 * @param CurrentTimeStamp
 * @param $timeout
 */
function employeeDetailController($scope, USDateFormat, IsoDateFormat, $rootScope, $modal, $http, $location, $cookieStore, $filter, fileReader, $window, CurrentTimeStamp, $timeout) {
    //Rootscope variables used to select the Accordion menus.
    $rootScope.manage = true;
    $rootScope.selectedMenu = 'Employee';

    //Object used to copy the employee detail object
    $scope.ClonedEmployeeDetail = {};
    $rootScope.calledFromEmployeeDetail = true;
    $scope.timeOff = [];
    $scope.UploadDocumentsOptionVisible = true;
    $scope.attachmentsContainerVisible = false;
    $scope.minDate = $scope.minDate ? null : new Date();
    $scope.alerts = [];
    $scope.showEmptyContactDetail = false;
    $scope.defaultContactType = '';
    $scope.isError = false;
    $scope.needFormat = true;
    $scope.mapOptions = {};
    $scope.needMapCall = {
        "callMap": false
    };
    $scope.inCreateMode = false;
    $scope.addressKeys = ["addressStreet", "addressCity", "addressStateCode", "addressPostZip", "addressCountryISO"];
    $scope.contactTypeValue = [];
    $scope.contactTypeDetails = [];
    var timeInterval = "";
    $scope.isHireDateSetinServer = false;
    $scope.isTermDateSetinServer = false;

    /** 
     * Date validation for start and end date, start date should not be greater than end date
     */
    $('#hireDate').datepicker({
        dateFormat: 'mm-dd-yy',
        onSelect: function(dateStr) {
            var date = $(this).datepicker('getDate');
            if (date) {
                date.setDate(date.getDate() + 1);
            }
            $scope.disabledSave = false;
            $('#endDate').datepicker('option', 'minDate', date);
        }
    });

    /** 
     * Date validation for start and end date, start date should not be greater than end date
     */
    $('#endDate').datepicker({
        dateFormat: 'mm-dd-yy',
        onSelect: function(dateStr) {
            var date = $(this).datepicker('getDate');
            if (date) {
                date.setDate(date.getDate() - 1);
            }
            $scope.disabledSave = false;
            $('#hireDate').datepicker('option', 'maxDate', date || 0);

        }
    });
    
   
    /**
     * ==================================================================================================
     * Get the Managers List from the Rootscope if present otherwise
     * get it from the Employee List API.
     * ==================================================================================================
     */
    if ($rootScope.managerList != null)
        $scope.ManagerList = $rootScope.managerList;
    else {
        $http.get('/api/employeeList').success(function(data) {
            $scope.employeeList = data.data;
            //Getting all the Manager Names for the Detail page
            $scope.managers = [];
            angular.forEach($scope.employeeList, function(data, key) {
                if (!data.deleted && !data.isInactive) {
                    if (data.firstName != null && data.lastName != null) {
                        var manName = data.firstName + " " + data.lastName;
                        $scope.managers.push({
                            "name": manName,
                            "id": data.id
                        });
                    } else if (data.lastName != null) {
                        var manName = data.lastName;
                        $scope.managers.push({
                            "name": manName,
                            "id": data.id
                        });
                    }
                }
            });
            $rootScope.managerList = $scope.managers;
            $scope.ManagerList = $rootScope.managerList;
        }).error(function(data) {
            console.log("Manager list not available");
        });
    }

    //Redirect to Employee page if history is cleared
    if ($cookieStore.get("detailId") == null)
        $location.path('/Employee');



    /**
     * ==========================================================================================================
     * Function used to truncate the url.
     * Once the Image path comes correctly from the server, we can remove this function.
     * ==========================================================================================================
     */
    $scope.truncateurl = function() {

        if (($scope.EmployeeDetail.data.photoUrl != null) && ($scope.EmployeeDetail.data.photoUrl != '')) {
            var urlArray = $scope.EmployeeDetail.data.photoUrl.split('/');
            if (urlArray.length == 8) {
                var constructedUrl = "/"
                for (var j = 5; j < urlArray.length; j++) {
                    constructedUrl += urlArray[j];
                    if (j != (urlArray.length - 1))
                        constructedUrl += "/";
                }
                $scope.EmployeeDetail.data.photoUrl = constructedUrl;
            }

        }

    }
    /**
     * =====================================================================================================
     * Map Object
     * =====================================================================================================
     */
    
    $scope.formatMapData = function()
    {
    	if ($scope.EmployeeDetail != null) {
            if ($scope.EmployeeDetail.data.addressCountryISO != null) {
                if ($scope.countries != null) {
                    angular.forEach($scope.countries, function(data, key) {
                        if (data.code == $scope.EmployeeDetail.data.addressCountryISO)
                            $scope.EmployeeDetail.data.addressCountryISO = data;
                    });
                }
            }
        }
        if ($scope.EmployeeDetail != null) {
            if ($scope.EmployeeDetail.data.addressStateCode != null) {
                if ($scope.states != null) {
                    angular.forEach($scope.states, function(data, key) {
                        if (data.code == $scope.EmployeeDetail.data.addressStateCode)
                            $scope.EmployeeDetail.data.addressStateCode = data;
                    });
                }
            }

        }
        if ($scope.EmployeeDetail != null) {
	        if ($scope.EmployeeDetail.data.hireDate != null) {
	            $scope.isHireDateSetinServer = true;
	            $scope.EmployeeDetail.data.hireDate = USDateFormat.convert($scope.EmployeeDetail.data.hireDate);
	        }
	
	        if ($scope.EmployeeDetail.data.termDate != null) {
	            $scope.isTermDateSetinServer = true;
	            $scope.EmployeeDetail.data.termDate = USDateFormat.convert($scope.EmployeeDetail.data.termDate);
	        }
        }
    }
    /**
     * ========================================================================================================
     * Function Used to map the country code to the country name during GET and POST.
     * ========================================================================================================
     */
    $scope.formatInputData = function() {

        if ($scope.EmployeeDetail != null) {
        	if($scope.EmployeeDetail.data.contactNumbers != null)
        	{
        		var length = $scope.EmployeeDetail.data.contactNumbers.length;
                for (var i = 0; i < $scope.EmployeeDetail.data.contactNumbers.length; i++) {
                    $scope.contactTypeDetails[i] = $scope.EmployeeDetail.data.contactNumbers[i].details;
                    $scope.contactTypeValue[i] = $scope.EmployeeDetail.data.contactNumbers[i].type;
                }
        	}
            
        }

    }

    /**
     * ====================================================================================================
     * Function used to format the cost amount
     * ====================================================================================================
     */

    $scope.formatCostamt = function() {
        if ($scope.EmployeeDetail.data.otCostAmt == '' || $scope.EmployeeDetail.data.otCostAmt == null)
            return;
        $scope.EmployeeDetail.data.otCostAmt = $scope.EmployeeDetail.data.otCostAmt.toFixed(2);
    }

    /**
     * =======================================================================================================
     * Function used to format the stdamt
     * =======================================================================================================
     */
    $scope.formatStdamt = function() {
        if ($scope.EmployeeDetail.data.stdCostAmt == '' || $scope.EmployeeDetail.data.stdCostAmt == null)
            return;
        $scope.EmployeeDetail.data.stdCostAmt = $scope.EmployeeDetail.data.stdCostAmt.toFixed(2);
    }
    /**
     * =====================================================================================================
     * API Call to get the Employee Detail based on the employee id.
     * =====================================================================================================
     */
    if ($cookieStore.get("detailId") == 'create') {

        $scope.EmployeeDetail = {
            "success": true,
            "total": 0,
            "data": {
                "employeeId": "",
                "firstName": "",
                "lastName": "",
                "fullName": "",
                "nickname": "",
                "isPartTime": false,
                "isContractor": false,
                "departmentId": "",
                "job": "",
                "timeOff": []
            }
        }
        $scope.showEmptyContactDetail = true;
        if ($scope.EmployeeDetail.data.contactNumbers == null || $scope.EmployeeDetail.data.contactNumbers.length === 0) {
            $scope.EmployeeDetail.data.contactNumbers = [];
            $scope.EmployeeDetail.data.contactNumbers.push({});
            $scope.contactTypeValue[0] = "email";
            $scope.contactTypeDetails[0] = "";
        }
        if ($scope.EmployeeDetail.data.timeOff == null || $scope.EmployeeDetail.data.timeOff.length == 0) {
            $scope.EmployeeDetail.data.timeOff = [{
                'type': 'Vacation',
                'allowance': 0,
                'taken': 0
            }, {
                'type': 'Sick',
                'allowance': 0,
                'taken': 0
            }];
        }
        for (var i = 0; i < $scope.EmployeeDetail.data.timeOff.length; i++) {
            $scope.timeOff.push({
                'type': $scope.EmployeeDetail.data.timeOff[i].type,
                'allowance': $scope.EmployeeDetail.data.timeOff[i].allowance,
                'taken': $scope.EmployeeDetail.data.timeOff[i].taken,
                'balance': $scope.EmployeeDetail.data.timeOff[i].allowance - $scope.EmployeeDetail.data.timeOff[i].taken
            });
        }
        $scope.mapOptions = $scope.EmployeeDetail;
        angular.copy($scope.EmployeeDetail, $scope.ClonedEmployeeDetail, true);
        $scope.inCreateMode = true;
    } else {
        if ($cookieStore.get("detailId") != null) {
            $http.get('/api/employeeDetail/' + $cookieStore.get("detailId")).success(function(data) {
                $scope.EmployeeDetail = data;
                $scope.truncateurl();
                $scope.mapOptions = $scope.EmployeeDetail;
                $scope.needMapCall.callMap = true;
                if ($scope.EmployeeDetail.data.contactNumbers == null || $scope.EmployeeDetail.data.contactNumbers.length === 0) {
                    $scope.EmployeeDetail.data.contactNumbers = [];
                    $scope.EmployeeDetail.data.contactNumbers.push({});
                    $scope.contactTypeValue[0] = "email";
                    $scope.contactTypeDetails[0] = "";
                }
                if ($scope.EmployeeDetail.data.timeOff == null || $scope.EmployeeDetail.data.timeOff.length == 0) {
                    $scope.EmployeeDetail.data.timeOff = [{
                        'type': 'Vacation',
                        'allowance': 0,
                        'taken': 0
                    }, {
                        'type': 'Sick',
                        'allowance': 0,
                        'taken': 0
                    }];

                }
                for (var i = 0; i < $scope.EmployeeDetail.data.timeOff.length; i++) {
                    $scope.timeOff.push({
                        'type': $scope.EmployeeDetail.data.timeOff[i].type,
                        'allowance': $scope.EmployeeDetail.data.timeOff[i].allowance,
                        'taken': $scope.EmployeeDetail.data.timeOff[i].taken,
                        'balance': $scope.EmployeeDetail.data.timeOff[i].allowance - $scope.EmployeeDetail.data.timeOff[i].taken
                    });
                }
                $scope.formatCostamt();
                $scope.formatStdamt();
                $scope.formatInputData();
                if($scope.EmployeeDetail.data.stdCostCur == null)
					 $scope.EmployeeDetail.data.stdCostCur = 'USD';
                if($scope.EmployeeDetail.data.otCostCur == null)
					 $scope.EmployeeDetail.data.otCostCur = 'USD';
                //Clone the object before pre-processing the input data.
                angular.copy($scope.EmployeeDetail, $scope.ClonedEmployeeDetail, true);
                $scope.formatMapData();
                console.log($scope.ClonedEmployeeDetail);
                console.log($scope.EmployeeDetail);
                $scope.isError = false;
            }).error(function(data, status) {

                $scope.addAlert("Employee Detail not available.", "danger");
               // $scope.isError = true;

                /**
                 * ===========================================================
                 * Code Used for Local Testing. Finally It should be removed
                 * ============================================================
                 */

                 $scope.EmployeeDetail = $rootScope.EmployeeDetailObject[$cookieStore.get("detailId")];
				 $scope.truncateurl();
                 $scope.mapOptions = $scope.EmployeeDetail;
                 $scope.needMapCall.callMap = true;
				 //$scope.geocoding();
                 if ($scope.EmployeeDetail.data.contactNumbers == null || $scope.EmployeeDetail.data.contactNumbers.length === 0) {
                	$scope.EmployeeDetail.data.contactNumbers =[];
					 $scope.EmployeeDetail.data.contactNumbers.push({});
					 $scope.contactTypeValue[0]="Phone";
					 $scope.contactTypeDetails[0]="";
				 }
				if ($scope.EmployeeDetail.data.timeOff == null || $scope.EmployeeDetail.data.timeOff.length == 0)	{
				 $scope.EmployeeDetail.data.timeOff = [{'type' : 'Vacation', 'allowance': 0, 'taken': 0},{'type' : 'Sick', 'allowance': 0, 'taken': 0}];
				 
				}		
				for (var i = 0; i < $scope.EmployeeDetail.data.timeOff.length; i++ ) {			
					$scope.timeOff.push({'type': $scope.EmployeeDetail.data.timeOff[i].type, 'allowance': $scope.EmployeeDetail.data.timeOff[i].allowance, 'taken': $scope.EmployeeDetail.data.timeOff[i].taken, 'balance': $scope.EmployeeDetail.data.timeOff[i].allowance - $scope.EmployeeDetail.data.timeOff[i].taken});			
				}	
				$scope.formatCostamt();
				$scope.formatStdamt();
				$scope.formatInputData();
				if($scope.EmployeeDetail.data.stdCostCur == null)
					 $scope.EmployeeDetail.data.stdCostCur = 'USD';
               if($scope.EmployeeDetail.data.otCostCur == null)
					 $scope.EmployeeDetail.data.otCostCur = 'USD';
				angular.copy($scope.EmployeeDetail,$scope.ClonedEmployeeDetail,true);
				console.log($scope.ClonedEmployeeDetail);
		        console.log($scope.EmployeeDetail);
				$scope.formatMapData();
	           
            });
        }
    }


    /**
     * ========================================================================================================
     * API call to get the Departments available for the employee
     * ========================================================================================================
     */
    if ($rootScope.localCache.department == null) {
        $http.get('/api/find/department').success(function(data) {
            $scope.departments = data.data;
            $rootScope.localCache.department = $scope.departments;
        }).error(function(data, status) {

            /**
             * =============================================================
             * Code Used for Local Testing. It should be removed finally.
             * =============================================================
             */
            $scope.departmentJson = {
						    "success": true,
						    "total": 4,
						    "dataType": "department",
						    "data": [
						        {
						            "name": "Development",
						            "id": "53ac290d9c1c37083b3d38ac"
						        },
						        {
						            "name": "Operations",
						            "id": "53ac29159c1c37083b3d38ad"
						        },
						        {
						            "name": "Finance",
						            "id": "53ac291c9c1c37083b3d38ae"
						        },
						        {
						            "name": "Consulting",
						            "id": "53ac29229c1c37083b3d38af"
						        }
						    ]
						}
				 $scope.departments = $scope.departmentJson.data;
				 $rootScope.localCache.department = $scope.departments;
        });
    } else {
        //For eliminating the API Calls when the data is available in local cache
        $scope.departments = $rootScope.localCache.department;
    }


    /**
     * =========================================================
     * API call to get the Jobs available for the employee
     * ===========================================================
     */

    if ($rootScope.localCache.jobs == null) {
        $http.get('/api/listData/jobs').success(function(data) {
            $scope.jobs = data.data;
            $rootScope.localCache.jobs = $scope.jobs;
        }).error(function(data, status) {
            /**
             * ==================================================================
             * Code used for Local Testing. It should be removed finally.
             * ==================================================================
             */
             $scope.jobsJson = {"success":true,"total":1,"data":["Manager","Consultant","Tea Boy"]};
			 $scope.jobs = $scope.jobsJson.data;	
			 $rootScope.localCache.jobs = $scope.jobs;
        });
    } else {
        //For eliminating the API Calls when the data is available in local cache
        $scope.jobs = $rootScope.localCache.jobs;
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
            $scope.formatMapData();
        }).error(function(data, status) {
            /**
             * ===========================================================================
             * Codes used for local testing and it should be removed finally.
             * ============================================================================
             */
            $scope.state_namesJson = {"success":true,"total":1,"data":[{"name":"Alabama","code":"AL"},{"name":"Alaska","code":"AK"},{"name":"Arizona","code":"AZ"},{"name":"Arkansas","code":"AR"},{"name":"California","code":"CA"},{"name":"Colorado","code":"CO"},{"name":"Connecticut","code":"CT"},{"name":"Delaware","code":"DE"},{"name":"District of Columbia","code":"DC"},{"name":"Florida","code":"FL"},{"name":"Georgia","code":"GA"},{"name":"Hawaii","code":"HI"},{"name":"Idaho","code":"ID"},{"name":"Illinois","code":"IL"},{"name":"Indiana","code":"IN"},{"name":"Iowa","code":"IA"},{"name":"Kansa","code":"KS"},{"name":"Kentucky","code":"KY"},{"name":"Lousiana","code":"LA"},{"name":"Maine","code":"ME"},{"name":"Maryland","code":"MD"},{"name":"Massachusetts","code":"MA"},{"name":"Michigan","code":"MI"},{"name":"Minnesota","code":"MN"},{"name":"Mississippi","code":"MS"},{"name":"Missouri","code":"MO"},{"name":"Montana","code":"MT"},{"name":"Nebraska","code":"NE"},{"name":"Nevada","code":"NV"},{"name":"New Hampshire","code":"NH"},{"name":"New Jersey","code":"NJ"},{"name":"New Mexico","code":"NM"},{"name":"New York","code":"NY"},{"name":"North Carolina","code":"NC"},{"name":"North Dakota","code":"ND"},{"name":"Ohio","code":"OH"},{"name":"Oklahoma","code":"OK"},{"name":"Oregon","code":"OR"},{"name":"Pennsylvania","code":"PA"},{"name":"Rhode Island","code":"RI"},{"name":"South Carolina","code":"SC"},{"name":"South Dakota","code":"SD"},{"name":"Tennessee","code":"TN"},{"name":"Texas","code":"TX"},{"name":"Utah","code":"UT"},{"name":"Vermont","code":"VT"},{"name":"Virginia","code":"VA"},{"name":"Washington","code":"WA"},{"name":"West Virginia","code":"WV"},{"name":"Wisconsin","code":"WI"},{"name":"Wyoming","code":"WY"}]};		
				$scope.states = $scope.state_namesJson.data;
				$rootScope.localCache.states = $scope.states;
				$scope.formatInputData();
        });
    } else {
        $scope.states = $rootScope.localCache.states;
        $scope.formatInputData();
        $scope.formatMapData();
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
            $scope.formatMapData();
        }).error(function(data, status) {
        	 /**
              * ===========================================================================
              * Codes used for local testing and it should be removed finally.
              * ============================================================================
              */
           $scope.countriesJson = {
                "success": true,
                "total": 1,
                "data": [{"name":"Ascension Island","code":"AC"},{"name":"Andorra","code":"AD"},{"name":"United Arab Emirates","code":"AE"},{"name":"Afghanistan","code":"AF"},{"name":"Antigua And Barbuda","code":"AG"},{"name":"Anguilla","code":"AI"},{"name":"Albania","code":"AL"},{"name":"Armenia","code":"AM"},{"name":"Angola","code":"AO"},{"name":"Antarctica","code":"AQ"},{"name":"Argentina","code":"AR"},{"name":"American Samoa","code":"AS"},{"name":"Austria","code":"AT"},{"name":"Australia","code":"AU"},{"name":"Aruba","code":"AW"},{"name":"Azerbaijan","code":"AZ"},{"name":"Bosnia & Herzegovina","code":"BA"},{"name":"Barbados","code":"BB"},{"name":"Bangladesh","code":"BD"},{"name":"Belgium","code":"BE"},{"name":"Burkina Faso","code":"BF"},{"name":"Bulgaria","code":"BG"},{"name":"Bahrain","code":"BH"},{"name":"Burundi","code":"BI"},{"name":"Benin","code":"BJ"},{"name":"Bermuda","code":"BM"},{"name":"Brunei Darussalam","code":"BN"},{"name":"Bolivia, Plurinational State Of","code":"BO"},{"name":"Afghanistan","code":"AF"},{"name":"Antigua And Barbuda","code":"AG"},{"name":"Anguilla","code":"AI"},{"name":"Albania","code":"AL"},{"name":"Armenia","code":"AM"},{"name":"Angola","code":"AO"},{"name":"Antarctica","code":"AQ"},{"name":"Argentina","code":"AR"},{"name":"American Samoa","code":"AS"},{"name":"Austria","code":"AT"},{"name":"Australia","code":"AU"},{"name":"Aruba","code":"AW"},{"name":"Azerbaijan","code":"AZ"},{"name":"Bosnia & Herzegovina","code":"BA"},{"name":"Barbados","code":"BB"},{"name":"Bangladesh","code":"BD"},{"name":"Belgium","code":"BE"},{"name":"Burkina Faso","code":"BF"},{"name":"Bulgaria","code":"BG"},{"name":"Bahrain","code":"BH"},{"name":"Burundi","code":"BI"},{"name":"Benin","code":"BJ"},{"name":"Bermuda","code":"BM"},{"name":"Brunei Darussalam","code":"BN"},{"name":"Bolivia, Plurinational State Of","code":"BO"},{"name":"Bonaire, Saint Eustatius And Saba","code":"BQ"},{"name":"Brazil","code":"BR"},{"name":"Bahamas","code":"BS"},{"name":"Bhutan","code":"BT"},{"name":"Bouvet Island","code":"BV"},{"name":"Botswana","code":"BW"},{"name":"Belarus","code":"BY"},{"name":"Belize","code":"BZ"},{"name":"Canada","code":"CA"},{"name":"Cocos (Keeling) Islands","code":"CC"},{"name":"Democratic Republic Of Congo","code":"CD"},{"name":"Central African Republic","code":"CF"},{"name":"Republic Of Congo","code":"CG"},{"name":"Switzerland","code":"CH"},{"name":"Cote d'Ivoire","code":"CI"},{"name":"Cook Islands","code":"CK"},{"name":"Chile","code":"CL"},{"name":"Cameroon","code":"CM"},{"name":"China","code":"CN"},{"name":"Colombia","code":"CO"},{"name":"Clipperton Island","code":"CP"},{"name":"Costa Rica","code":"CR"},{"name":"Cuba","code":"CU"},{"name":"Cape Verde","code":"CV"},{"name":"Curacao","code":"CW"},{"name":"Christmas Island","code":"CX"},{"name":"Cyprus","code":"CY"},{"name":"Czech Republic","code":"CZ"},{"name":"Germany","code":"DE"},{"name":"Diego Garcia","code":"DG"},{"name":"Djibouti","code":"DJ"},{"name":"Denmark","code":"DK"},{"name":"Dominica","code":"DM"},{"name":"Dominican Republic","code":"DO"},{"name":"Algeria","code":"DZ"},{"name":"Ceuta, Mulilla","code":"EA"},{"name":"Ecuador","code":"EC"},{"name":"Estonia","code":"EE"},{"name":"Egypt","code":"EG"},{"name":"Western Sahara","code":"EH"},{"name":"Eritrea","code":"ER"},{"name":"Spain","code":"ES"},{"name":"Ethiopia","code":"ET"},{"name":"European Union","code":"EU"},{"name":"Finland","code":"FI"},{"name":"Fiji","code":"FJ"},{"name":"Falkland Islands","code":"FK"},{"name":"Micronesia, Federated States Of","code":"FM"},{"name":"Faroe Islands","code":"FO"},{"name":"France","code":"FR"},{"name":"France, Metropolitan","code":"FX"},{"name":"Gabon","code":"GA"},{"name":"United Kingdom","code":"GB"},{"name":"Grenada","code":"GD"},{"name":"Georgia","code":"GE"},{"name":"French Guiana","code":"GF"},{"name":"Guernsey","code":"GG"},{"name":"Ghana","code":"GH"},{"name":"Gibraltar","code":"GI"},{"name":"Greenland","code":"GL"},{"name":"Gambia","code":"GM"},{"name":"Great Britain","code":"GB"},{"name":"Guinea","code":"GN"},{"name":"Guadeloupe","code":"GP"},{"name":"Equatorial Guinea","code":"GQ"},{"name":"Greece","code":"GR"},{"name":"South Georgia And The South Sandwich Islands","code":"GS"},{"name":"Guatemala","code":"GT"},{"name":"Guam","code":"GU"},{"name":"Guinea-bissau","code":"GW"},{"name":"Guyana","code":"GY"},{"name":"Hong Kong","code":"HK"},{"name":"Heard Island And McDonald Islands","code":"HM"},{"name":"Honduras","code":"HN"},{"name":"Croatia","code":"HR"},{"name":"Haiti","code":"HT"},{"name":"Hungary","code":"HU"},{"name":"Canary Islands","code":"IC"},{"name":"Indonesia","code":"ID"},{"name":"Ireland","code":"IE"},{"name":"Israel","code":"IL"},{"name":"Isle Of Man","code":"IM"},{"name":"India","code":"IN"},{"name":"British Indian Ocean Territory","code":"IO"},{"name":"Iraq","code":"IQ"},{"name":"Iran, Islamic Republic Of","code":"IR"},{"name":"Iceland","code":"IS"},{"name":"Italy","code":"IT"},{"name":"Jersey","code":"JE"},{"name":"Jamaica","code":"JM"},{"name":"Jordan","code":"JO"},{"name":"Japan","code":"JP"},{"name":"Kenya","code":"KE"},{"name":"Kyrgyzstan","code":"KG"},{"name":"Cambodia","code":"KH"},{"name":"Kiribati","code":"KI"},{"name":"Comoros","code":"KM"},{"name":"Saint Kitts And Nevis","code":"KN"},{"name":"Korea, Democratic People's Republic Of","code":"KP"},{"name":"Korea, Republic Of","code":"KR"},{"name":"Kuwait","code":"KW"},{"name":"Cayman Islands","code":"KY"},{"name":"Kazakhstan","code":"KZ"},{"name":"Lao People's Democratic Republic","code":"LA"},{"name":"Lebanon","code":"LB"},{"name":"Saint Lucia","code":"LC"},{"name":"Liechtenstein","code":"LI"},{"name":"Sri Lanka","code":"LK"},{"name":"Liberia","code":"LR"},{"name":"Lesotho","code":"LS"},{"name":"Lithuania","code":"LT"},{"name":"Luxembourg","code":"LU"},{"name":"Latvia","code":"LV"},{"name":"Libya","code":"LY"},{"name":"Morocco","code":"MA"},{"name":"Monaco","code":"MC"},{"name":"Moldova","code":"MD"},{"name":"Montenegro","code":"ME"},{"name":"Saint Martin","code":"MF"},{"name":"Madagascar","code":"MG"},{"name":"Marshall Islands","code":"MH"},{"name":"Macedonia, The Former Yugoslav Republic Of","code":"MK"},{"name":"Mali","code":"ML"},{"name":"Myanmar","code":"MM"},{"name":"Mongolia","code":"MN"},{"name":"Macao","code":"MO"},{"name":"Northern Mariana Islands","code":"MP"},{"name":"Martinique","code":"MQ"},{"name":"Mauritania","code":"MR"},{"name":"Montserrat","code":"MS"},{"name":"Malta","code":"MT"},{"name":"Mauritius","code":"MU"},{"name":"Maldives","code":"MV"},{"name":"Malawi","code":"MW"},{"name":"Mexico","code":"MX"},{"name":"Malaysia","code":"MY"},{"name":"Mozambique","code":"MZ"},{"name":"Namibia","code":"NA"},{"name":"New Caledonia","code":"NC"},{"name":"Niger","code":"NE"},{"name":"Norfolk Island","code":"NF"},{"name":"Nigeria","code":"NG"},{"name":"Nicaragua","code":"NI"},{"name":"Netherlands","code":"NL"},{"name":"Norway","code":"NO"},{"name":"Nepal","code":"NP"},{"name":"Nauru","code":"NR"},{"name":"Niue","code":"NU"},{"name":"New Zealand","code":"NZ"},{"name":"Oman","code":"OM"},{"name":"Panama","code":"PA"},{"name":"Peru","code":"PE"},{"name":"French Polynesia","code":"PF"},{"name":"Papua New Guinea","code":"PG"},{"name":"Philippines","code":"PH"},{"name":"Pakistan","code":"PK"},{"name":"Poland","code":"PL"},{"name":"Saint Pierre And Miquelon","code":"PM"},{"name":"Pitcairn","code":"PN"},{"name":"Puerto Rico","code":"PR"},{"name":"Palestinian Territory, Occupied","code":"PS"},{"name":"Portugal","code":"PT"},{"name":"Palau","code":"PW"},{"name":"Paraguay","code":"PY"},{"name":"Qatar","code":"QA"},{"name":"Reunion","code":"RE"},{"name":"Romania","code":"RO"},{"name":"Serbia","code":"RS"},{"name":"Russian Federation","code":"RU"},{"name":"Rwanda","code":"RW"},{"name":"Saudi Arabia","code":"SA"},{"name":"Solomon Islands","code":"SB"},{"name":"Seychelles","code":"SC"},{"name":"Sudan","code":"SD"},{"name":"Sweden","code":"SE"},{"name":"Singapore","code":"SG"},{"name":"Saint Helena, Ascension And Tristan Da Cunha","code":"SH"},{"name":"Slovenia","code":"SI"},{"name":"Svalbard And Jan Mayen","code":"SJ"},{"name":"Slovakia","code":"SK"},{"name":"Sierra Leone","code":"SL"},{"name":"San Marino","code":"SM"},{"name":"Senegal","code":"SN"},{"name":"Somalia","code":"SO"},{"name":"Suriname","code":"SR"},{"name":"South Sudan","code":"SS"},{"name":"SÃŒÂ£o TomÃŒÂ© and PrÃŒ_ncipe","code":"ST"},{"name":"USSR","code":"SU"},{"name":"El Salvador","code":"SV"},{"name":"Sint Maarten","code":"SX"},{"name":"Syrian Arab Republic","code":"SY"},{"name":"Swaziland","code":"SZ"},{"name":"Tristan de Cunha","code":"TA"},{"name":"Turks And Caicos Islands","code":"TC"},{"name":"Chad","code":"TD"},{"name":"French Southern Territories","code":"TF"},{"name":"Togo","code":"TG"},{"name":"Thailand","code":"TH"},{"name":"Tajikistan","code":"TJ"},{"name":"Tokelau","code":"TK"},{"name":"East Timor","code":"TL"},{"name":"Turkmenistan","code":"TM"},{"name":"Tunisia","code":"TN"},{"name":"Tonga","code":"TO"},{"name":"Turkey","code":"TR"},{"name":"Trinidad And Tobago","code":"TT"},{"name":"Tuvalu","code":"TV"},{"name":"Taiwan, Province Of China","code":"TW"},{"name":"Tanzania, United Republic Of","code":"TZ"},{"name":"Ukraine","code":"UA"},{"name":"Uganda","code":"UG"},{"name":"United Kingdom","code":"GB"},{"name":"United States Minor Outlying Islands","code":"UM"},{"name":"United States","code":"US"},{"name":"Uruguay","code":"UY"},{"name":"Uzbekistan","code":"UZ"},{"name":"Vatican City State","code":"VA"},{"name":"Saint Vincent And The Grenadines","code":"VC"},{"name":"Venezuela, Bolivarian Republic Of","code":"VE"},{"name":"Virgin Islands (British)","code":"VG"},{"name":"Virgin Islands (US)","code":"VI"},{"name":"Viet Nam","code":"VN"},{"name":"Vanuatu","code":"VU"},{"name":"Wallis And Futuna","code":"WF"},{"name":"Samoa","code":"WS"},{"name":"Yemen","code":"YE"},{"name":"Mayotte","code":"YT"},{"name":"South Africa","code":"ZA"},{"name":"Zambia","code":"ZM"},{"name":"Zimbabwe","code":"ZW"}]
            };
            $scope.countries = $scope.countriesJson.data;
            $rootScope.localCache.countries = $scope.countries;
            $scope.formatInputData();
        });
    } else {
        $scope.countries = $rootScope.localCache.countries;
        $scope.formatInputData();
        $scope.formatMapData();
    }


    /**
     * ==============================================================
     * API call to get the Jobs available for the employee
     * ==============================================================
     */
    if ($rootScope.localCache.contactNumTypes == null) {
        $http.get('/api/listData/contactNumberTypes').success(function(data) {
            $scope.contactNumberTypes = data.data;
            $rootScope.localCache.contactNumTypes = $scope.contactNumberTypes;
        }).error(function(data, status) {
        	 /**
              * ===========================================================================
              * Codes used for local testing and it should be removed finally.
              * ============================================================================
              */
            $scope.contactNumberTypesJson = {
                "success": true,
                "total": 1,
                "data": ["Phone", "email", "Skype", "LinkedIn"]
            };
            $scope.contactNumberTypes = $scope.contactNumberTypesJson.data;
            $rootScope.localCache.contactNumTypes = $scope.contactNumberTypes;
        });
    } else {
        $scope.contactNumberTypes = $rootScope.localCache.contactNumTypes;
    }

    /**
     * ================================================================
     * Time Off grid object options
     * ================================================================
     */
    $scope.empTimeOffGridOptions = {
        data: 'timeOff',
        enableColumnResize: true,
        columnDefs: [{
            field: 'type',
            displayName: '',
            width: '20%'
        }, {
            field: '',
            displayName: 'Allowance',
            cellTemplate: '<label class="allowance-text right-justify" ng-bind="row.entity.allowance"></label>',
            width: '20%'
        }, {
            field: 'taken',
            displayName: 'Taken',
            cellTemplate: '<label class="taken-text right-justify" ng-bind="row.entity.taken"></label>',
            width: '20%'
        }, {
            field: 'balance',
            displayName: 'Balance',
            cellTemplate: '<label class="balance-text right-justify" ng-bind="row.entity.balance"></label>',
            width: '20%'
        }, {
            dispalyName: '',
            cellTemplate: '<a href= "javascript:void(0);">details</a>',
            width: '20%'
        }]
    };


    /**
     * ================================================================================
     * Function used to save contact numbers with their sequence numbers
     * ===============================================================================
     */
    $scope.saveContactNumbers = function() {
        var isInvalidEmail = false;
        for (var i = 0; i < $scope.contactTypeDetails.length; i++) {
            if ($scope.contactTypeValue[i] == "" || $scope.contactTypeValue[i] == null)
                continue;
            if ($scope.contactTypeValue[i].toLowerCase() == "email") {
                var email_regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (!email_regex.test($scope.contactTypeDetails[i])) {
                    isInvalidEmail = true;
                    break;
                }
            }
        }
        if (!isInvalidEmail) {
            $scope.EmployeeDetail.data.contactNumbers = [];

            var emailSeq = -1;
            var phoneSeq = -1;
            var linkedinSeq = -1;
            var skypeSeq = -1;
            for (var i = 0; i < $scope.contactTypeDetails.length; i++) {
                if ($scope.contactTypeDetails[i] == "" || $scope.contactTypeValue[i] == "" || $scope.contactTypeValue[i] == null || $scope.contactTypeDetails[i] == null)
                    continue;
                if ($scope.contactTypeValue[i].toLowerCase() == "email") {
                    emailSeq++;
                    $scope.EmployeeDetail.data.contactNumbers.push({
                        "details": $scope.contactTypeDetails[i],
                        "seq": emailSeq,
                        "type": $scope.contactTypeValue[i]
                    })
                }
                if ($scope.contactTypeValue[i].toLowerCase() == "phone") {
                    phoneSeq++;
                    $scope.EmployeeDetail.data.contactNumbers.push({
                        "details": $scope.contactTypeDetails[i],
                        "seq": phoneSeq,
                        "type": $scope.contactTypeValue[i]
                    })
                }
                if ($scope.contactTypeValue[i].toLowerCase() == "skype") {
                    skypeSeq++;
                    $scope.EmployeeDetail.data.contactNumbers.push({
                        "details": $scope.contactTypeDetails[i],
                        "seq": skypeSeq,
                        "type": $scope.contactTypeValue[i]
                    })
                }
                if ($scope.contactTypeValue[i].toLowerCase() == "linkedin") {
                    linkedinSeq++;
                    $scope.EmployeeDetail.data.contactNumbers.push({
                        "details": $scope.contactTypeDetails[i],
                        "seq": linkedinSeq,
                        "type": $scope.contactTypeValue[i]
                    })
                }


            }
        }

        return isInvalidEmail;
    }
    /**
     * For deleting the selected row from contact detail tabular data
     */
    $scope.deleteEmployeeContactInfo = function(index) {
        $scope.contactTypeDetails.splice(index, 1);
        $scope.contactTypeValue.splice(index, 1);
        $scope.EmployeeDetail.data.contactNumbers.splice(index, 1);
        if ($scope.EmployeeDetail.data.contactNumbers.length == 0) {
            $scope.EmployeeDetail.data.contactNumbers.push({});
            $scope.contactTypeDetails[0] = "";
            $scope.contactTypeValue[0] = "Phone";

        }
    };
    /**
     * Showing new row for accepting new contact detail from user
     */
    $scope.addEmployeeContactInfo = function() {
        var length = $scope.EmployeeDetail.data.contactNumbers.length;
        $scope.EmployeeDetail.data.contactNumbers.push({});
        $scope.contactTypeDetails[length] = "";
        $scope.contactTypeValue[length] = $scope.contactNumberTypes[0];

    }

    $scope.addAlert = function(message, type) {
        $scope.alerts = [];
        $scope.alerts.push({
            "message": message,
            "type": type
        });
        $window.scrollTo(0, 0);
    }
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
     * =================================================================================
     * Name Formatter function.
     * Function used to assign First and last Name
     * =================================================================================
     */
    $scope.assignNames = function() {
        var nameArray = [];
        nameArray = $scope.EmployeeDetail.data.nickname.split(" ");
        switch (nameArray.length) {
            case 1:
                $scope.EmployeeDetail.data.lastName = $scope.EmployeeDetail.data.nickname;
                break;
            case 2:
                $scope.EmployeeDetail.data.lastName = nameArray[1];
                $scope.EmployeeDetail.data.firstName = nameArray[0];
                break;
            case 3:
                //$scope.EmployeeDetail.data.middleName = nameArray[1]; //Middle name key is not available.Once give uncomment it.
                $scope.EmployeeDetail.data.lastName = nameArray[2];
                $scope.EmployeeDetail.data.firstName = nameArray[0];
                break;
            default:
                //Commented since middle name key is not present. Once key is provided uncomment the lines
                /*$scope.EmployeeDetail.data.middleName="";
		 		for(var i =1; i<nameArray.length-1 ; i++)
		 		{
		 			$scope.EmployeeDetail.data.middleName += nameArray[i]+" "; //For Concatenating the remaining names in the middel name in case of more than 3 name in the array.
		 		}*/
                $scope.EmployeeDetail.data.lastName = nameArray[nameArray.length - 1];
                $scope.EmployeeDetail.data.firstName = nameArray[0];
                break;
        }

    }

    /**
     * ==================================================================================
     * Image File Selection Function.
     * Function used to get the file and display it in the UI.
     * ==================================================================================
     */
    $scope.isImageuploaded = false;
    $scope.getFile = function() {
        fileReader.readAsDataUrl($scope.file, $scope)
            .then(function(result) {
                $scope.imageSrc = result;
                if ($('.PersonImage').width() > 120)
                    $scope.containImg = true;
                $scope.disabledSave = false;
                $scope.isImageuploaded = true;
            });
    };



    /**
     * ===================================================================================
     * Function used to navigate back to the employee list page.
     * It updates the employee Detail if there is any changes in the employee detail object or
     * it will navigate back to the employee list page.
     * ===================================================================================
     */
    $scope.backtoEmp = function() {
        //To Skip saving during create
        if (!($cookieStore.get("detailId") == 'create')) {
            if ($scope.isError) {
                $rootScope.localCache.isEmpAPINeeded = false;
                $location.path('/Employee');
                return;
            }

            $scope.checkDateisChanged();
            if (!angular.equals($scope.ClonedEmployeeDetail, $scope.EmployeeDetail)) {
                if ($scope.EmployeeDetail.data.nickname == "") {
                    $scope.addAlert("Enter Employee Name.", "danger");
                    return;
                }
                $scope.closeAlert();
                $scope.saveEmpdata();
            } else {
                if (!$rootScope.localCache.isEmpAPINeeded)
                    $rootScope.localCache.isEmpAPINeeded = false;
            }
        } else {
            $rootScope.localCache.isEmpAPINeeded = false;
        }
        $location.path('/Employee');
    }

    /**
     * =========================================================================================
     * Function used for formatting the data before posting.
     * =========================================================================================
     */
    $scope.formatPostData = function() {
        //For Converting String to Integer
        if ($scope.EmployeeDetail.data.otCostAmt != null)
            $scope.EmployeeDetail.data.otCostAmt = parseFloat($scope.EmployeeDetail.data.otCostAmt);
        else
        {
        	if($scope.EmployeeDetail.data.otCostCur != null)
        		delete $scope.EmployeeDetail.data.otCostCur;
        }

        if ($scope.EmployeeDetail.data.stdCostAmt != null)
            $scope.EmployeeDetail.data.stdCostAmt = parseFloat($scope.EmployeeDetail.data.stdCostAmt);
        else
        {
        	if($scope.EmployeeDetail.data.stdCostCur != null)
        		delete $scope.EmployeeDetail.data.stdCostCur;
        }

        $scope.EmployeeDetail.data.fullName = $scope.EmployeeDetail.data.nickname;

        if ($scope.EmployeeDetail.data.addressStateCode != null)
            $scope.EmployeeDetail.data.addressStateCode = $scope.EmployeeDetail.data.addressStateCode.code;
        if ($scope.EmployeeDetail.data.addressCountryISO != null)
            $scope.EmployeeDetail.data.addressCountryISO = $scope.EmployeeDetail.data.addressCountryISO.code;

        if ($scope.EmployeeDetail.data.hireDate == "" && !$scope.isHireDateSetinServer)
            delete $scope.EmployeeDetail.data.hireDate;
        if ($scope.EmployeeDetail.data.termDate == "" && !$scope.isTermDateSetinServer)
            delete $scope.EmployeeDetail.data.termDate;
        
        angular.forEach($scope.ManagerList,function(data,key){
        	if(data.id == $scope.EmployeeDetail.data.managerId)
        		$scope.EmployeeDetail.data.managerName = data.name;
        });

    }



    /**
     * =================================================================================
     *   Image Upload Function
     *   Function used to upload the image to the server.
     *   Image File and contact ID is appended to the formData and posted to the server.
     *   Content-Type:undefined in angularJs will map internally to the multi-part/formData.
     *   ===============================================================================
     */
    $scope.imageUpload = function() {

        var fd = new FormData();
        fd.append('file', $scope.file);
        fd.append('contactId', $cookieStore.get("detailId"));
        $http.post('/api/upload/photo', fd, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        }).success(function(data, status) {
            console.log("Image Updated Successfully");
            $scope.addAlert("Image Updated Successfully", "success");
            $scope.isImageuploaded = false;
            $rootScope.localCache.isEmpAPINeeded = true;
        }).error(function(data, status) {
            console.log("Imaged Update Failed");
            $scope.addAlert("Image update failed", "danger");
            $scope.isImageuploaded = false;
            $scope.inSave = false;
            if (status == 500) {
                //.....
            }
            if (status == 304) {
                //..
            }
            if (status == 413) {
                if ($scope.addAlert != null)
                    $scope.addAlert("Image update failed:Image file exceeds maximum area.Please choose a file under 1MB.", "danger");
                $rootScope.addAlert("Image update failed:Image file exceeds maximum area.Please choose a file under 1MB.", "danger");

            }
        });
    }
    /**
     * ======================================================================================
     * Function used to set the date in ISO format before posting to the server
     * ======================================================================================
     */
    $scope.checkDateisChanged = function() {
        if ($('#hireDate').val() != "")
            $scope.EmployeeDetail.data.hireDate = IsoDateFormat.convert($('#hireDate').val());
        else
            $scope.EmployeeDetail.data.hireDate = $('#hireDate').val();

        if ($('#endDate').val() != "")
            $scope.EmployeeDetail.data.termDate = IsoDateFormat.convert($('#endDate').val());
        else
            $scope.EmployeeDetail.data.termDate = $('#endDate').val();
    }



    /**
     * ==================================================================================
     * Function used to save the Employee details when save button is clicked
     * or when back button is clicked when there is any changes in the employee
     * detail object.
     * ==================================================================================
     *
     */
   
    $scope.saveEmpdata = function() {
    	console.log($scope.EmployeeDetail);
        $scope.inSave = true;
        var email_result;
        //Call Image Upload Function
        if ($scope.isImageuploaded) {
            if ($cookieStore.get("detailId") != 'create') {
                $scope.imageUpload();
            }
        }
       
       
        $scope.tempEmployeeDetail = {};
        angular.copy($scope.EmployeeDetail,$scope.tempEmployeeDetail,true);
        console.log($scope.ClonedEmployeeDetail);console.log($scope.tempEmployeeDetail);
        console.log(angular.equals($scope.ClonedEmployeeDetail, $scope.tempEmployeeDetail));
        $scope.checkDateisChanged();
        if ((!angular.equals($scope.ClonedEmployeeDetail, $scope.tempEmployeeDetail))) {
            //For Alerting the mandatory field Nickname
            if ($scope.EmployeeDetail.data.nickname == "") {
                $scope.addAlert("Enter Employee Name.", "danger");
                $scope.inSave = false;
                $scope.needFormat = false;
                return;
            } else {
                $scope.assignNames(); //For assigning the first,last name to the post object
            }
            if ($scope.saveContactNumbers()) {
                $scope.addAlert("Enter valid email address.", "danger");
                $scope.inSave = false;
                $scope.needFormat = false;
                return;
            }
            $scope.closeAlert(); //Used to close the alert message before proceeding.
            //For Mapping the departmentName based on the selected departmentID
            angular.forEach($scope.departments, function(data, key) {
                if (data.id == $scope.EmployeeDetail.data.departmentId)
                    $scope.EmployeeDetail.data.departmentName = data.name;
            });

            //Validation for Typeahead - To prevent data which are not available in the options
            if (($scope.EmployeeDetail.data.addressCountryISO != '') && ($scope.EmployeeDetail.data.addressCountryISO != null))
                if ($scope.Validatetypeahead($scope.countries, $scope.EmployeeDetail.data.addressCountryISO.name, "name", "Enter a valid Country Code", "danger") == false) {
                    $scope.inSave = false;
                    return;
                }
            if (($scope.EmployeeDetail.data.addressStateCode != '') && ($scope.EmployeeDetail.data.addressStateCode != null))
                if ($scope.Validatetypeahead($scope.states, $scope.EmployeeDetail.data.addressStateCode.name, "name", "Enter a valid State Code", "danger") == false) {
                    $scope.inSave = false;
                    return;
                }

            $scope.needMapCall.callMap = true;

            $scope.formatPostData();

            var postData = $scope.EmployeeDetail.data;
            var postTime = CurrentTimeStamp.postTimeStamp();
            $http({
                "method": "post",
                "url": '/api/employeeDetail/update?timestamp=' + postTime,
                "data": postData,
                "headers": {
                    "content-type": "application/json"
                }
            }).success(function(data) {
                $scope.addAlert("Updated successfully", "success");
                $scope.EmployeeDetail = data;
                if ($cookieStore.get("detailId") == 'create') {
                    $cookieStore.put("detailId", data.data.id);
                    if ($scope.isImageuploaded)
                        $scope.imageUpload();
                }
                $scope.formatCostamt();
                $scope.formatStdamt();
                $scope.formatInputData();
                $scope.formatMapData();
                $scope.isImageuploaded = false;
                $scope.inSave = false;
                $rootScope.localCache.isEmpAPINeeded = true;
                angular.copy($scope.EmployeeDetail, $scope.ClonedEmployeeDetail, true);
                $scope.inCreateMode = false;
                $scope.disabledSave = true;
                timeInterval = $timeout(function() {
                    $location.path('/Employee');
                }, 1000);


            }).error(function(data, status) {
                $scope.addAlert("Update failed", "danger");                
                /*$scope.formatCostamt();
                $scope.formatStdamt();
                $scope.formatInputData();*/
                $scope.isImageuploaded = false;
                $scope.inSave = false;
                $rootScope.localCache.isEmpAPINeeded = false;

            });
        }
    }


    /**
     * ===================================================================================
     * Function used to Delete the Employee Record
     * @param size - size of the pop up window
     * =====================================================================================
     */
    $scope.confirmDelete = function(size) {

        $rootScope.showModal('/api/delete/contact/' + $cookieStore.get("detailId"), 'Confirm Delete', 'Are you sure you would like to delete ' + $scope.EmployeeDetail.data.nickname + '<span></span> ? This action can not be undone.', 'Cancel', 'Confirm');
        $scope.$watch('isPostSuccess', function(nValue, oValue) {
            if (nValue == null || (nValue == oValue))
                return;
            if ($rootScope.isPostSuccess) {
                $rootScope.localCache.isEmpAPINeeded = true;
                $location.path('/Employee');
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
     * Watcher for the Employee List object
     * ==================================================================================
     */
    $scope.inSave = false;
    $scope.$watch('EmployeeDetail', function(nValue, oValue) {
        if (!$scope.inSave) {
            if (nValue != oValue) {
                if (!angular.equals($scope.ClonedEmployeeDetail, $scope.EmployeeDetail))
                    $scope.disabledSave = false;
            }
        }


    }, true);
    /**
     * ==================================================================================
     * Watcher watched the change in the contact info
     * ==================================================================================
     */
    $scope.$watch('employeeNewContact.info', function(nValue, oValue) {
        if (!$scope.inSave) {
            if (nValue != oValue) {
                if (nValue == '' || nValue == null)
                    return;
                $scope.disabledSave = false;
            }
        }

    }, true);

    /**
     * Destroying the interval on destroy of this page.
     */
    $scope.$on('$destroy', function() {
        $timeout.cancel(timeInterval);
    });

}