//======================================================================================================//
/**
 * ContactModalController - Controller of the Customer Detail page
 * @param $scope
 * @param $rootScope
 * @param $modal
 * @param $http
 * @param CurrentTimeStamp
 * @param $cookieStore
 * @param fileReader
 */
//======================================================================================================//
angular.module('redPandaApp').controller('ContactModalController', ['$scope', '$rootScope', '$route', '$http', 'CurrentTimeStamp', '$cookieStore','fileReader',
    function($scope, $rootScope, $route, $http, CurrentTimeStamp, $cookieStore,fileReader) {

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
                if ($('.PersonImage').width() > 120)
                    $scope.containImg = true;
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
    $scope.UploadImage = function(isCreate) {
        var contactID = "";
        if (isCreate != null)
            contactID = isCreate;
        else
            contactID = $cookieStore.get("contactID");
        var fd = new FormData();
        fd.append('file', $scope.file);
        fd.append('contactId', contactID);
        $http.post('/api/upload/photo', fd, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        }).success(function(data, status) {

            $scope.addAlert("Image Updated Successfully", "success");
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
        //
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
                if ($scope.isImageuploaded && $cookieStore.get("contactID") != "create") {
                        $scope.UploadImage();
                }

                if ($scope.contactDetail.data.nickname == "" || $scope.contactDetail.data.nickname == null) {
                    $scope.isRequired = true;
                    return;
                }                
                
                if ($scope.contactDetail.data.addressStateCode != null) {
                    var stateCode = $scope.contactDetail.data.addressStateCode;
                    if (typeof stateCode == 'object')
                        $scope.contactDetail.data.addressStateCode = stateCode.code;
                }
                if ($scope.contactDetail.data.addressCountryISO != null) {
                    var countryCode = $scope.contactDetail.data.addressCountryISO;
                    if (typeof countryCode == 'object') {
                        $scope.contactDetail.data.addressCountryISO = countryCode.code;
                        $scope.contactDetail.data.addressCountryName = countryCode.name;
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
                        if ($scope.isImageuploaded && $cookieStore.get("contactID") == "create") {
                            //$cookieStore.put("contactID",$scope.custContactList.id);
                            $scope.UploadImage($scope.custContactList.id);
                        }
                        if ($cookieStore.get("contactID") == "create") {
                            $rootScope.modalInstance.close(formatContactData($scope.custContactList));
                        } else {
                            $rootScope.modalInstance.close(formatContactData($scope.custContactList));
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
        $rootScope.modalInstance.dismiss('cancel');
    };



}]);
