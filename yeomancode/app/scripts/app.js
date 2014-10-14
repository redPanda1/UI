/**
 * Including other dependency modules into the main module "redPandaApp"
 * ng-Route - Module used for routing in AngularJS.
 * ui.calendar - Module used for including calendar in the app.
 * ui.bootstrp - Module used for Angular Bootstrap Js.
 * ngGrid - Module used for the AngularJS table.
 * google-maps - Module used for displaying maps
 */

angular
  .module('redPandaApp', ['ngRoute','ui.bootstrap','ngGrid','ngCookies','google-maps'])
  .config(function ($routeProvider,$locationProvider,$httpProvider) {
    $routeProvider
        .when('/login',{
         templateUrl:'views/Login.html'})
         .when('/Registration',{
         templateUrl:'views/Registration.html'})
         .when('/ResetPassword',{
         templateUrl:'views/ResetPassword.html'})
        .when('/Employee',{
         templateUrl:'views/Employee.html'})
        .when('/Home',{
         templateUrl:'views/HomePage.html'})
       .when('/Customer',{
         templateUrl:'views/Customer.html'})
       .when('/Contract',{
         templateUrl:'views/Contract.html'})
       .when('/ContractDetail',{
         templateUrl:'views/ContractDetail.html'})
        .when('/EmployeeDetail',{
         templateUrl:'views/EmployeeDetail.html'})
        .when('/CustomerDetail',{
         templateUrl:'views/CustomerDetail.html'})
      .otherwise({
        redirectTo: '/login'
      });
      $locationProvider.html5Mode(true);


    console.log("HTTPHEADERS");  
    console.log($httpProvider);
    //initialize get if not there
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};    
    }
    //disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
  });

/**
 * Main Controller.
 * Common AngularJs code related to shell can be placed here.
 * @param $scope
 * @param $location
 * @param $rootScope
 * @param $cookieStore
 * @param $window
 * @param $modal
 * @param $http
 */
angular.module('redPandaApp').controller('maincontroller', ['$scope','$location','$rootScope', '$cookieStore', '$window','$modal','$http', function($scope,$location,$rootScope, $cookieStore, $window,$modal,$http) 
{
	console.log("Current Path");
	console.log($location.path())
    $rootScope.selectedMenu = 'home'; //Selecting the Home Accordion by default
    $rootScope.localCache = {};
    $rootScope.fromCustomer = false;
    $rootScope.localCache.isEmpAPINeeded = false;
    $rootScope.localCache.isCustomerAPINeeded = false;
    $rootScope.localCache.isFindCustomerAPINeeded = false;
    $rootScope.localCache.customerContactId = '';
    $rootScope.calledFromEmployeeDetail = false;
    $rootScope.calledFromCustomerDetail = false;
    $rootScope.calledFromContractDetail = false;
    $rootScope.empDetailCache = {};
    loginSucccess                 = false;
    $rootScope.deleteCustomerContract = false;
	$rootScope.defaultUserImage = ""; 
	$rootScope.currentUserName  = ""; 
	$rootScope.currentUserId    = ""; 
	
	if ($rootScope.defaultUserImage  == ""){
		if($cookieStore.get("defaultUserImage") != null)
		  $rootScope.defaultUserImage = $cookieStore.get("defaultUserImage");
	}
	if ($rootScope.currentUserId  == ""){
		if($cookieStore.get("currentUserId") != null)
			$rootScope.currentUserId = $cookieStore.get("currentUserId");
	}
	if ($rootScope.currentUserName  == ""){
		if($cookieStore.get("currentUserName") != null)
			$rootScope.currentUserName = $cookieStore.get("currentUserName");
	}
	
	if ($cookieStore.get("enableApplication") == null)
	{
		$cookieStore.put("enableApplication",false);
		$rootScope.showApplication    = $cookieStore.get("enableApplication");

	}
	else{
		$rootScope.showApplication    = $cookieStore.get("enableApplication");
	}
	
    /**
     * Function used to navigate to the home page.
     * @param $rootScope
     */
    $scope.navHome = function($rootScope) {
        $location.path('/Home');
    }

    /**
     * Attaching the Resize event to the date picker element in
     * order to hide and display it again
     */
    angular.element($window).bind('resize', function() {
       
        var field = $(document.activeElement);
        if (field.is('.hasDatepicker')) {
            field.datepicker('hide').datepicker('show');
        }
        if (field.is('span.simplecolorpicker')) {
            $('span.picker').hide();
        }
        if (field[0].id="daterange") {
            $(".daterangepicker").hide()
        }
    });

    /**
     * Controller for the Pop-up. Used for handling the user action in the pop up.
     * @param $scope
     * @param $modalInstance
     */
    var modalcontroller = function($scope, $modalInstance) {

        /**
         * Function used to perform the specified action when ok
         * button is clicked.
         */
        $scope.ok = function() {
            $modalInstance.close();
        }

        /**
         * Function used to perform the specified action when cancel
         * button is clicked.
         */
        $scope.cancel = function() {
            $modalInstance.dismiss('dismiss');
        }
    }

    /**
     * Function used to open the Modal pop up
     * @param {{String}} postAPI
     * @param {{String}} modalHeader
     * @param {{String}} modalContent
     * @param {{String}} cancelBtn
     * @param {{String}} confirmBtn
     */
    $rootScope.showModal = function(postAPI, modalHeader, modalContent, cancelBtn, confirmbtn) {
    
        $rootScope.dialogHeader  = modalHeader;
    	$rootScope.dialogContent = modalContent;
    	$rootScope.cancelBtn     = cancelBtn;
    	$rootScope.confirmbtn    = confirmbtn;
    	
        $rootScope.dialogModal = $modal.open({
            //templateUrl: '/dist/views/ConfirmDialog.html'
            templateUrl: 'views/ConfirmDialog.html'

        });

        $rootScope.dialogModal.result.then(function() {
            $http.post(postAPI).success(function(data) {
                $rootScope.isPostSuccess = true;
            }).error(function(data, status) {
                $rootScope.isPostSuccess = false;
            });
        }, function() {
            console.log("Cancelled");
        });
    }

    /**
     * ============================================================================================
     * Function used for adding Alerts
     * ============================================================================================
     */

    /**
     * Function used to add alerts in the screen.
     * @param {String} message
     * @param {String} type
     * @param {String} header
     */
    controller: modalcontroller

    $rootScope.addAlert = function(message, type, header) {
        $rootScope.alerts = [];
        $rootScope.alerts.push({
            "message": message,
            "type": type,
            "header": header
        });
        $window.scrollTo(0, 0);
    }

    /**
     * Function used to close all the alerts in the screen.
     */
    $rootScope.closeAlert = function() {
        $rootScope.alerts = [];
    }

    /**
     * ====================================================================================================
     * Datas Used for Local Tesing
     * ====================================================================================================
     */

    $rootScope.customerData = {
        "success": true,
        "total": 8,
        "dataType": "customerList",
        "data": [{
            "id": "53b54b2d406e304a0af096a1",
            "customerId": "CUS002",
            "customerName": "GeoHay",
            "customerAddress": "Inman, SC",
            "commentsExist": false,
            "attachmentsExist": false
        }, {
            "id": "53b55c4eb583afd17f72170c",
            "customerId": "CUS004",
            "customerName": "Thompson PR",
            "customerAddress": "New York, NY",
            "commentsExist": false,
            "attachmentsExist": false
        }, {
            "id": "53c6887b02c7571f485ad86a",
            "customerName": "Avon Bakery",
            "commentsExist": false,
            "attachmentsExist": false
        }, {
            "id": "53c689d902c7571f485ad86b",
            "customerId": "CUS088",
            "customerName": "Avon Bakery",
            "customerAddress": "Avon, CO",
            "commentsExist": false,
            "attachmentsExist": false
        }, {
            "id": "53b55a43b583afd17f72170b",
            "customerId": "CUS003",
            "customerName": "Red Panda",
            "customerAddress": "Princeton, NJ",
            "commentsExist": false,
            "attachmentsExist": false
        }, {
            "id": "53b55c61b583afd17f72170d",
            "customerId": "CUS005",
            "customerName": "Traveller Inc.",
            "customerAddress": "DC, 20017",
            "commentsExist": false,
            "attachmentsExist": false
        }, {
            "id": "53d7ffac13a2e63528ae5372",
            "customerId": "CUS006",
            "customerName": "Rockhead",
            "customerAddress": "MD, 20850",
            "commentsExist": false,
            "attachmentsExist": false
        }, {
            "id": "53b41103353f736efcab467d",
            "customerId": "CUS001",
            "customerName": "Small World",
            "customerAddress": "Princeton, NJ",
            "commentsExist": false,
            "attachmentsExist": false
        }]
    }
    //Customer detail data
    $rootScope.customerDetail = {
        "success": true,
        "total": 1,
        "data": {
            "id": "53fdf562a2c94628879aa174",
            "customerId": "CUST004",
            "color": "#00ff99",
            "customerName": "Thompson PRs",
            "addressStreet": "44 W 28th Street",
            "addressCity": "New York",
            "addressStateCode": "NY",
            "addressStateName": "New York",
            "addressPostZip": "10001",
            "addressISOCountry": "US",
            "addressCountryName": "United States of America",
            "addressLat": 40.7456572,
            "addressLong": -73.99007039999998,
            "contactIds": ["53fe5abc03cd3d2d8df32473", "53fe5abc03cd3d2d8df32473"],
            "contactList": [{
                "id": "53fe5abc03cd3d2d8df32473",
                "type": "external",
                "companyName": "ThompsonPR.",
                "firstName": "Lisa",
                "lastName": "Hamilton",
                "name": "Lisa Hamilton",
                "address": "AK, 99501",
                "jobTitle": "Accountant.",
                "departmentName": "Management",
                "deleted": false
            }, {
                "id": "53fe5abc03cd3d2d8df32473",
                "type": "external",
                "companyName": "ThompsonPR.",
                "firstName": "Lisa",
                "lastName": "Hamilton",
                "name": "Lisa Hamilton",
                "address": "AK, 99501",
                "jobTitle": "Accountant.",
                "departmentName": "Management",
                "deleted": false
            }],
            "contractIds": ["53fe62c303cd3d2d8df32476"],
            "contractList": [{
                "id": "53fe62c303cd3d2d8df32476",
                "title": "Salmon Fishing",
                "poNumber": "PO 998877",
                "value": 0.0,
                "commentsExist": false,
                "attachmentsExist": false,
                "deleted": false
            }],
             "comments": [
            {
                "seqNo": 0,
                "postedBy": {
                    "thumbUrl": "img/sh_photo50.png",
                    "name": "ggggg title"
                },
                "postedOn": "2014-09-11T22:33:39.212Z",
                "replyTo": 0,
                "docRef": 0,
                "text": "This is another comment"
            },
            {
                "seqNo": 1,
                "postedBy": {
                    "thumbUrl": "img/sh_photo50.png",
                    "name": "ggggg title"
                },
                "postedOn": "2014-09-11T21:33:39.212Z",
                "replyTo": 0,
                "docRef": 0,
                "text": "This is a comment"
            },
            {
                "seqNo": 1,
                "postedBy": {
                    "thumbUrl": "img/sh_photo50.png",
                    "name": "Nisha Navlakha"
                },
                "postedOn": "2014-09-25T03:33:39.212Z",
                "replyTo": 0,
                "docRef": 0,
                "text": "And This is a third comment with lots and lots of text going on over several lines just to test that we are flexing the box sizes correctly. The test here should appear and the date should be at the end. A comment for teh people by the people and with teh people is the very best way to test this functionality - thank you"
            }
        ]
        }
    };
    //For Creating new Employee Detail this Employee Id can be used
    $rootScope.EmployeeID = "545789000abc012345655";

    $rootScope.EmployeeDetailObject = {
        "53ac275ee4b03340b6de4947": {
            "success": true,
            "total": 1,
            "data": {
                "id": "53ac275ee4b03340b6de4947",
                "employeeNumber": "PER00003",
                "photoUrl": "/data/resources/53b2fd2de4b0123558f41fe5.jpeg",
                "thumbUrl": "/data/resources/thumbnail.53b2fd2de4b0123558f41fe5.jpeg",
                "firstName": "Peter",
                "hireDate": "2014-09-05",
                "termDate": "2014-09-26",
                "lastName": "Blake",
                "fullName": "Peter Blake",
                "nickName": "Peter Blake",
                "isPartTime": false,
                "isContractor": false,
                "addressStreet": "23 Ridge Road",
                "contactNumbers": [{
                    "seq": 0,
                    "type": "email",
                    "details": "jennifer@xyz.com"
                }, {
                    "seq": 0,
                    "type": "phone",
                    "details": "4043456127"
                }],
                "addressCity": "Princeton",
                "addressStateCode": "NJ",
                "addressPostZip": "08540",
                "addressCountryISO": "US",
                "departmentId": "53ac29159c1c37083b3d38ad",
                "job": "Developer",
                "stdCostAmt": 88.5,
                "stdCostCur": "USD",
                "timeOff": [{
                    "type": "sick",
                    "allowance": 5,
                    "taken": 2.5
                }, {
                    "type": "vacation",
                    "allowance": 20,
                    "taken": 5
                }],
				 "comments": [
					{
						"seqNo": 0,
						"postedBy": {
							"thumbUrl": "/data/resources/thumbnail.53b2fd2de4b0123558f41fe5.jpeg",
							"name": "ggggg title"
						},
						"postedOn": "2014-09-29T14:36:16Z",
						"replyTo": 0,
						"docRef": 0,
						"text": "This is another comment"
					},
					{
						"seqNo": 1,
						"postedBy": {
							"thumbUrl": "/data/resources/thumbnail.53b2fd2de4b0123558f41fe5.jpeg",
							"name": "ggggg title"
						},
						"postedOn": "2014-09-11T21:33:39.212Z",
						"replyTo": 0,
						"docRef": 0,
						"text": "This is a comment"
					},
					{
						"seqNo": 1,
						"postedBy": {
							"thumbUrl": "/data/resources/thumbnail.53b2fd2de4b0123558f41fe5.jpeg",
							"name": "Nisha Navlakha"
						},
						"postedOn": "2014-09-28T03:33:39.212Z",
						"replyTo": 0,
						"docRef": 0,
						"text": "And This is a third comment with lots and lots of text going on over several lines just to test that we are flexing the box sizes correctly. The test here should appear and the date should be at the end. A comment for teh people by the people and with teh people is the very best way to test this functionality - thank you"
					}
				]
            }
        },
        "53ac2791e4b03340b6de4948": {
            "success": true,
            "total": 1,
            "data": {
                "id": "53ac2791e4b03340b6de4948",
                "employeeNumber": "PER00005",
                "photoUrl": "/data/resources/53b2fd39e4b0123558f41fe6.jpeg",
                "thumbUrl": "/data/resources/thumbnail.53b2fd39e4b0123558f41fe6.jpeg",
                "firstName": "Jennifer",
                "lastName": "Harvey",
                "fullName": "Jennifer Harvey",
                "nickName": "Jennifer Harvey",
                "isPartTime": false,
                "isContractor": false,
                "contactNumbers": [

                    {
                        "seq": 0,
                        "type": "email",
                        "details": "jennifer@xyz.com"
                    }, {
                        "seq": 0,
                        "type": "phone",
                        "details": "4043456127"
                    }
                ],
                "departmentName": "Peter Edgar Blake",
                "departmentId": "53ac291c9c1c37083b3d38ae",
                "managerId": "53ac275ee4b03340b6de4947",
                "job": "Accountant",
                "stdCostAmt": 88.5,
                "stdCostCur": "USD",
                "timeOff": [{
                    "type": "sick",
                    "allowance": 5,
                    "taken": 2.5
                }, {
                    "type": "vacation",
                    "allowance": 20,
                    "taken": 5
                }],
                "comments": [
					{
						"seqNo": 0,
						"postedBy": {
							"thumbUrl": "/data/resources/thumbnail.53b2fd2de4b0123558f41fe5.jpeg",
							"name": "ggggg title"
						},
						"postedOn": "2014-09-29T14:36:16Z",
						"replyTo": 0,
						"docRef": 0,
						"text": "This is another comment"
					},
					{
						"seqNo": 1,
						"postedBy": {
							"thumbUrl": "/data/resources/thumbnail.53b2fd2de4b0123558f41fe5.jpeg",
							"name": "ggggg title"
						},
						"postedOn": "2014-09-11T21:33:39.212Z",
						"replyTo": 0,
						"docRef": 0,
						"text": "This is a comment"
					},
					{
						"seqNo": 1,
						"postedBy": {
							"thumbUrl": "/data/resources/thumbnail.53b2fd2de4b0123558f41fe5.jpeg",
							"name": "Nisha Navlakha"
						},
						"postedOn": "2014-09-28T03:33:39.212Z",
						"replyTo": 0,
						"docRef": 0,
						"text": "And This is a third comment with lots and lots of text going on over several lines just to test that we are flexing the box sizes correctly. The test here should appear and the date should be at the end. A comment for teh people by the people and with teh people is the very best way to test this functionality - thank you"
					}
				]
            }
        },
        "53ac27b0e4b03340b6de4949": {
            "success": true,
            "total": 1,
            "data": {
                "id": "53ac27b0e4b03340b6de4949",
                "employeeId": "PER00099",
                "photoUrl": "/data/resources/53b2fc31e4b0123558f41fe2.jpeg",
                "thumbUrl": "/data/resources/thumbnail.53b2fc31e4b0123558f41fe2.jpeg",
                "firstName": "Richard",
                "lastName": "Minney",
                "fullName": "Richard Minney",
                "nickname": "Richard Minney",
                "isPartTime": false,
                "isContractor": true,
                "departmentName": "Peter Edgar Blake",
                "departmentId": "53ac29229c1c37083b3d38af",
                "managerId": "53ac275ee4b03340b6de4947",
                "job": "Support",
                "contactNumbers": [{
                    "seq": 0,
                    "type": "email",
                    "details": "jennifer@xyz.com"
                }, {
                    "seq": 0,
                    "type": "phone",
                    "details": "4043456127"
                }],
                "stdCostAmt": 88.5,
                "stdCostCur": "USD",
                "timeOff": [{
                    "type": "sick",
                    "allowance": 5,
                    "taken": 2.5
                }, {
                    "type": "vacation",
                    "allowance": 20,
                    "taken": 5
                }],
                "comments": [
					{
						"seqNo": 0,
						"postedBy": {
							"thumbUrl": "/data/resources/thumbnail.53b2fd2de4b0123558f41fe5.jpeg",
							"name": "ggggg title"
						},
						"postedOn": "2014-09-29T14:36:16Z",
						"replyTo": 0,
						"docRef": 0,
						"text": "This is another comment"
					},
					{
						"seqNo": 1,
						"postedBy": {
							"thumbUrl": "/data/resources/thumbnail.53b2fd2de4b0123558f41fe5.jpeg",
							"name": "ggggg title"
						},
						"postedOn": "2014-09-11T21:33:39.212Z",
						"replyTo": 0,
						"docRef": 0,
						"text": "This is a comment"
					},
					{
						"seqNo": 1,
						"postedBy": {
							"thumbUrl": "/data/resources/thumbnail.53b2fd2de4b0123558f41fe5.jpeg",
							"name": "Nisha Navlakha"
						},
						"postedOn": "2014-09-28T03:33:39.212Z",
						"replyTo": 0,
						"docRef": 0,
						"text": "And This is a third comment with lots and lots of text going on over several lines just to test that we are flexing the box sizes correctly. The test here should appear and the date should be at the end. A comment for teh people by the people and with teh people is the very best way to test this functionality - thank you"
					}
				]
            }
        },
        "53b435aa3c01cbf76dd3d796": {
            "success": true,
            "total": 1,
            "data": {
                "id": "53b435aa3c01cbf76dd3d796",
                "employeeNumber": "PER00035",
                "firstName": "Ellie",
                "lastName": "Clarke",
                "fullName": "Elenor Amy Clarke",
                "nickName": "Ellie clarke",
                "isPartTime": false,
                "isContractor": false,
                "addressStreet": "23 Ridge Road",
                "contactNumbers": [{
                    "seq": 0,
                    "type": "email",
                    "details": "jennifer@xyz.com"
                }, {
                    "seq": 0,
                    "type": "phone",
                    "details": "4043456127"
                }],
                "addressCity": "Princeton",
                "addressStateCode": "NJ",
                "addressPostZip": "08540",
                "addressCountryISO": "US",
                "departmentName": "Operations",
                "departmentId": "53ac29159c1c37083b3d38ad",
                "job": "Developer",
                "stdCostAmt": 88.5,
                "stdCostCur": "USD",
                "timeOff": [{
                    "type": "sick",
                    "allowance": 5,
                    "taken": 2.5
                }, {
                    "type": "vacation",
                    "allowance": 20,
                    "taken": 5
                }],
                "comments": [
					{
						"seqNo": 0,
						"postedBy": {
							"thumbUrl": "/data/resources/thumbnail.53b2fd2de4b0123558f41fe5.jpeg",
							"name": "ggggg title"
						},
						"postedOn": "2014-09-29T14:36:16Z",
						"replyTo": 0,
						"docRef": 0,
						"text": "This is another comment"
					},
					{
						"seqNo": 1,
						"postedBy": {
							"thumbUrl": "/data/resources/thumbnail.53b2fd2de4b0123558f41fe5.jpeg",
							"name": "ggggg title"
						},
						"postedOn": "2014-09-11T21:33:39.212Z",
						"replyTo": 0,
						"docRef": 0,
						"text": "This is a comment"
					},
					{
						"seqNo": 1,
						"postedBy": {
							"thumbUrl": "/data/resources/thumbnail.53b2fd2de4b0123558f41fe5.jpeg",
							"name": "Nisha Navlakha"
						},
						"postedOn": "2014-09-28T03:33:39.212Z",
						"replyTo": 0,
						"docRef": 0,
						"text": "And This is a third comment with lots and lots of text going on over several lines just to test that we are flexing the box sizes correctly. The test here should appear and the date should be at the end. A comment for teh people by the people and with teh people is the very best way to test this functionality - thank you"
					}
				]
            }
        }
    };
    $rootScope.customerContactDataNew = {
        "success": true,
        "total": 1,
        "data": {
            "id": "54046343e4b0212332b4fdf3",
            "type": "external",
            "firstName": "Lynn",
            "lastName": "Taylor",
            "fullName": "Lynn Taylor",
            "nickName": "Lynn Taylor George",
            "addressStreet": "245 Nassau Street",
            "addressCity": "Princeton",
            "addressStateCode": "NJ",
            "addressStateName": "New Jersey",
            "addressPostZip": "08542",
            "addressCountryISO": "US",
            "addressCountryName": "United States of America",
            "addressLat": 40.351598,
            "addressLong": -74.651275,
            "contactNumbers": [{
                "seq": 0,
                "type": "email",
                "details": "lynn@traveller.com"
            }, {
                "seq": 0,
                "type": "LinkedIn",
                "details": "lynn@traveller.com"
            }, {
                "seq": 0,
                "type": "Phone",
                "details": "123456789"
            }],
            "companyName": "Traveller, Inc..",
            "jobTitle": "Analyst"
        }
    }
    $rootScope.newContactDetails = {
        "success": true,
        "total": 1,
        "data": {
            "id": "5405560de4b0212332b4fdf9",
            "poNumber": "TESTPO123",
            "title": "TITLE DESCRIPT",
            "customerId": "53fdf63ea2c94628879aa175",
            "customerName": "ABC Inc.",
            "value": 0.0,
            "budgetedHours": 0.0,
            "deleted": false
        }
    }
    $rootScope.employeeData = {
        "success": true,
        "total": 4,
        "dataType": "employeeList",
        "data": [{
            "id": "53ac275ee4b03340b6de4947",
            "employeeNumber": "PER00003PER00003PER00003PER00003PER00003PER00003",
            "thumbUrl": "/data/resources/thumbnail.53b2fd2de4b0123558f41fe5.jpeg",
            "firstName": "Peter",
            "lastName": "Blake",
            "job": "Developer",
            "inactive": false,
            "commentsExist": false,
            "attachmentsExist": false
        }, {
            "id": "53ac2791e4b03340b6de4948",
            "employeeNumber": "PER00005",
            "thumbUrl": "/data/resources/thumbnail.53b2fd39e4b0123558f41fe6.jpeg",
            "firstName": "Jennifer",
            "lastName": "Harvey",
            "job": "Accountant",
            "managerName": "Peter Edgar Blake",
            "isPartTime": false,
            "isContractor": false,
            "inactive": false,
            "commentsExist": false,
            "attachmentsExist": false
        }, {
            "id": "53ac27b0e4b03340b6de4949",
            "employeeNumber": "PER00099",
            "thumbUrl": "/data/resources/thumbnail.53b2fc31e4b0123558f41fe2.jpeg",
            "firstName": "Richard",
            "lastName": "Minney",
            "job": "Support",
            "managerName": "Peter Edgar Blake",
            "isPartTime": false,
            "isContractor": true,
            "inactive": true,
            "commentsExist": false,
            "attachmentsExist": false
        }, {
            "id": "53b435aa3c01cbf76dd3d796",
            "employeeId": "PER00035",
            "firstName": "Ellie",
            "lastName": "Clarke",
            "job": "Developer",
            "inactive": false,
            "commentsExist": false,
            "attachmentsExist": false
        }]
    }
    $rootScope.ContractData = {
        "success": true,
        "total": 8,
        "dataType": "contractList",
        "data": [{
            "id": "53d80c0713a2e63528ae5379",
            "title": "Pad Line Repair update",
            "poNumber": "PO 434575",
            "startDate": "2014-08-01",
            "endDate": "2014-09-03",
            "value": 882.0,
            "currency": "USD",
            "customerId": "5403d5d0e4b0212332b4fdd5",
            "customerName": "The Mann Einstein Players",
            "commentsExist": false,
            "attachmentsExist": false,
            "deleted": false
        }, {
            "id": "53ff24e7e4b01a8bc7506b5c",
            "title": "testing contracts",
            "poNumber": "PO Wanted",
            "startDate": "2014-09-11",
            "endDate": "2014-09-13",
            "value": 3500.0,
            "currency": "USD",
            "managerId": "53ac1cac9c1c37083b3d38ab",
            "managerName": "Ken Thompson",
            "customerId": "53fdf562a2c94628879aa174",
            "customerName": "Thompson PRs",
            "commentsExist": false,
            "attachmentsExist": false,
            "deleted": false
        }, {
            "id": "53fe62fa03cd3d2d8df32477",
            "title": "African Safari Testing",
            "poNumber": "PO8877",
            "startDate": "2014-09-26",
            "endDate": "2014-09-29",
            "value": 12501.0,
            "currency": "USD",
            "customerId": "53fdf562a2c94628879aa174",
            "customerName": "Thompson PRs",
            "commentsExist": false,
            "attachmentsExist": false,
            "deleted": false
        }, {
            "id": "5400d0dce4b0212332b4fdcb",
            "title": "Pile Driver",
            "poNumber": "PO 098999 - NEW Testing",
            "startDate": "2014-08-01",
            "endDate": "2014-09-09",
            "value": 1500001.0,
            "currency": "USD",
            "customerId": "53fdf4aca2c94628879aa172",
            "customerName": "GeoHay",
            "commentsExist": false,
            "attachmentsExist": false,
            "deleted": false
        }, {
            "id": "5403f405e4b0212332b4fddb",
            "title": "Help Documents",
            "value": 0.0,
            "customerId": "53fdf562a2c94628879aa174",
            "customerName": "Thompson PRs",
            "commentsExist": false,
            "attachmentsExist": false,
            "deleted": false
        }, {
            "id": "5403f58ce4b0212332b4fddc",
            "title": "Macbook Screen",
            "poNumber": "PO2013",
            "value": 0.0,
            "customerId": "53fdf29aa2c94628879aa170",
            "customerName": "Apple Computers",
            "commentsExist": false,
            "attachmentsExist": false,
            "deleted": false
        }, {
            "id": "53ff0d93e4b01a8bc7506b4f",
            "title": "Application",
            "poNumber": "PO12345",
            "startDate": "2014-09-25",
            "endDate": "2014-09-27",
            "value": 200000.0,
            "currency": "USD",
            "commentsExist": false,
            "attachmentsExist": false,
            "deleted": false
        }, {
            "id": "54045120e4b0212332b4fdf1",
            "title": "New Contract",
            "poNumber": "PO1234",
            "startDate": "2014-09-26",
            "endDate": "2014-09-30",
            "value": 0.0,
            "customerId": "5404080ce4b0212332b4fdde",
            "customerName": "countryw/ostate",
            "commentsExist": false,
            "attachmentsExist": false,
            "deleted": true
        }]
    }
	$rootScope.login = {
    "success": true,
    "total": 1,
    "data": {
        "clientUrl": "aswinkumars",
        "userId": "aswinkumar.s@npcompete.net",
        "userName": "Aswinkumar S",
        "companyId": "542f9e62e4b092153ee0970e",
        "companyName": "aswinkumars",
        "language": "en",
        "stdHours": 40,
        "themeColor": "#a91e22",
        "themeTextColor": "#ffffff",
        "themeIconUrl": "http://redpandaalpha.com/resources/rpLogoW120.png"
    }
}
    $rootScope.ContractDetailData = {
    "success": true,
    "total": 1,
    "data": {
        "id": "53d80b2313a2e63528ae5378",
        "poNumber": "PO 887664",
        "title": "Double Shot",
        "customerId": "53b41103353f736efcab467d",
        "startDate": "2014-09-05",
        "endDate": "2014-09-06",
        "customerName": "Small World",
        "type": "fee",
        "value": 0,
        "managerName":"Peter Blake",
        "budgetedHours": 67,
        "assignedData": [],
        "activityData": [],
        "comments": [
					{
						"seqNo": 0,
						"postedBy": {
							"name": "ggggg title"
						},
						"postedOn": "2014-09-29T14:36:16Z",
						"replyTo": 0,
						"docRef": 0,
						"text": "This is another comment"
					},
					{
						"seqNo": 1,
						"postedBy": {

							"name": "ggggg title"
						},
						"postedOn": "2014-09-11T21:33:39.212Z",
						"replyTo": 0,
						"docRef": 0,
						"text": "This is a comment"
					},
					{
						"seqNo": 1,
						"postedBy": {

							"name": "Nisha Navlakha"
						},
						"postedOn": "2014-09-28T03:33:39.212Z",
						"replyTo": 0,
						"docRef": 0,
						"text": "And This is a third comment with lots and lots of text going on over several lines just to test that we are flexing the box sizes correctly. The test here should appear and the date should be at the end. A comment for teh people by the people and with teh people is the very best way to test this functionality - thank you"
					}
				]
    }
}

	$rootScope.newContractActivityData =
	{
    "success": true,
    "total": 1,
    "data": {
        "id": "54197b2ce4b084e5935f2f72",
        "isStandard": false,
        "isInternal": false,
        "title": "Test to show correct creation of an activity",
        "status": 0,
        "start": "2014-07-23",
        "end": "2014-09-30",
        "isBillable": false,
        "isFixedFee": false,
        "rateAmt": 0,
        "feeAmt": 0,
        "customerId": "5406ed16e4b0544656725bdc",
        "customerName": "TestName",
        "customerColor": "#fbd75b",
        "contractId": "5406ecf5e4b0544656725bdb",
        "contractName": "Example T&M with activity pricing",
        "deleted": false
    	}
	}
	/*
	* For navigating to the application, once login is done, remove the below function
	*/
	$rootScope.temporaryNavigation = function(){
		//$rootScope.showApplication = true;
		$window.scrollTo(0, 0);		
		$location.path('/Home');
	}
	
}]);

/**
 * =======================================================================================================
 * AngularJS Directives
 * =======================================================================================================
 */


/**
 * DatePicker Directive used for displaying the datepickers
 */
angular.module('redPandaApp').directive('datepickers', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            00
            element.datepicker({
                dateFormat: attrs.format ? attrs.format : 'yy-mm-dd'
            });
        }
    };
});

/**
 * Directive used for editable text box in pop up
 */
angular.module('redPandaApp').directive('xeditable', function($timeout) {
    return {
        restrict: 'A',
        require: "ngModel",
        link: function(scope, element, attrs, ngModel) {
            var loadXeditable = function() {
                angular.element(element).editable({
                    display: function(value, srcData) {
                        ngModel.$setViewValue(value);
                        scope.$apply();
                    }
                });
            }
            $timeout(function() {
                loadXeditable();
            }, 1);
        }
    };
});




/**
 * Multiple selector drop down selector
 */
angular.module('redPandaApp').directive('dropdownMultiselect', function() {
    return {
        restrict: 'E',
        scope: {
            model: '=',
            options: '=',
            pre_selected: '=preSelected',
            tablemodel: '=tablemodel'
        },
        replace: true,
        template: "<div class='btn-group department dropdown' data-ng-class='{open: open}'>" +
            "<button class='btn btn-small multiselect-btn'><div class='depaertment-select'><span ng-show='model.length == 0'>--Select--</span><span ng-repeat='mod in model'>{{mod}}<span ng-show='($index !=-1 && !$last)'>,</span></span></div></button>" +
            "<button class='btn btn-small dropdown-toggle' data-ng-click='open=!open;openDropdown()'><span class='caret'></span></button>" +
            "<ul class='dropdown-menu' aria-labelledby='dropdownMenu'>" +
            "<li data-ng-repeat='option in options'><a data-ng-click='setSelectedItem()'>{{option.name.nickName}}<span data-ng-class='isChecked(option.name.nickName)'></span></a></li>" +
            "</ul>" +
            "</div>",
        controller: function($scope, $rootScope) {
            $scope.model = [];
            angular.forEach($rootScope.ClonedSelectedManager, function(data, key) {

                $scope.model.push(data.name)
            });
            $scope.setSelectedItem = function() {
                if (this.option.name == null || this.option.name.nickName == null)
                    return;
                var name = this.option.name.nickName;

                if (_.contains($scope.model, name)) {
                    for (var i = 0; i < $scope.model.length; i++) {
                        if ($scope.model[i] == name) {
                            $scope.tablemodel.splice(i, 1);
                            $scope.model.splice(i, 1);
                        }
                    }

                } else {
                    $scope.model.push(name);
                    $scope.tablemodel.push({
                        "name": name
                    });
                }
                return false;
            };
            $scope.isChecked = function(name) {
                if (_.contains($scope.model, name)) {
                    return 'glyphicon glyphicon-ok pull-right';
                }
                return false;
            };
        }
    }
});

/**
 * For handling 2dp value for standard time cost
 */
angular.module('redPandaApp').directive('isStdtimeTwodp', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attr, model) {
            scope.$watch('EmployeeDetail.data.stdCostAmt', function(newValue, oldValue) {
                if (newValue == '' || newValue == null)
                    return;
                var arr = String(newValue).split("");
                if (arr.length === 0) return;
                if (arr.length === 1 && arr[0] === '.') return;
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] === '.' && arr.length - 1 - i > 2) {
                        scope.EmployeeDetail.data.stdCostAmt = oldValue;
                    }
                }
                if (isNaN(newValue)) {
                    if (scope.EmployeeDetail == null)
                        return;
                    scope.EmployeeDetail.data.stdCostAmt = oldValue;
                }
            });
            element.bind('blur', function(event) {
                var val = event.target.value;
                if (val == '')
                    return;
                scope.EmployeeDetail.data.stdCostAmt = Number(event.target.value).toFixed(2);
                scope.$apply();
            });

        }
    };
});
/**
 * For handling 2dp value for hourly Rate
 */
angular.module('redPandaApp').directive('hourlyRate', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attr, ctrl) {
            scope.$watch(attr.ngModel, function(newValue, oldValue) {
                if (newValue == '' || newValue == null)
                    return;
                var arr = String(newValue).split("");
                if (arr.length === 0) return;
                if (arr.length === 1 && arr[0] === '.') return;
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] === '.' && arr.length - 1 - i > 2) {
                        ctrl.$setViewValue(oldValue);
                        ctrl.$render();
                    }
                }
                if (isNaN(newValue)) {
                    ctrl.$setViewValue(oldValue);
                    ctrl.$render();
                }
            });
            element.bind('blur', function(event) {
                var val = event.target.value;
                if (val == '')
                    return;
                ctrl.$setViewValue(Number(event.target.value).toFixed(2));
                ctrl.$render();
            });

        }
    };
});



/**
 * For handling 2dp value for overtime cost
 */
angular.module('redPandaApp').directive('isValue', function() {
    return {
        require: 'ngModel',
        link: function(scope, element) {
            scope.$watch('contractDetail.data.value', function(newValue, oldValue) {
                if (newValue == '' || newValue == null)
                    return;
                var data = String(newValue).split("");
                if (data.length === 0) return;
                if (data.length === 1 && data[0] === '.') return;
                for (var i = 0; i < data.length; i++) {
                    if (data[i] === '.' && data.length - 1 - i > 2) {
                        scope.contractDetail.data.value = oldValue;
                    }
                }
                if (isNaN(newValue)) {
                    if (scope.contractDetail == null)
                        return;
                    scope.contractDetail.data.value = oldValue;
                }
            });
            element.bind('blur', function(event) {
                var val = event.target.value;
                if (val == '')
                    return;
                scope.contractDetail.data.value = Number(event.target.value).toFixed(2);
                scope.$apply();
            });
        }
    };
});


/**
 * For handling 2dp value for budgeted hours
 */
angular.module('redPandaApp').directive('twoDecimalPoints', function() {
    return {
        require: 'ngModel',
        link: function(scope, element) {
            scope.$watch('contractDetail.data.budgetedHours', function(newValue, oldValue) {
                if (newValue == '' || newValue == null)
                    return;
                var data = String(newValue).split("");
                if (data.length === 0) return;
                if (data.length === 1 && data[0] === '.') return;
                for (var i = 0; i < data.length; i++) {
                    if (data[i] === '.' && data.length - 1 - i > 2) {
                        scope.contractDetail.data.budgetedHours = oldValue;
                    }
                }
                if (isNaN(newValue)) {
                    if (scope.contractDetail == null)
                        return;
                    scope.contractDetail.data.budgetedHours = oldValue;
                }
            });
            element.bind('blur', function(event) {
                var val = event.target.value;
                if (val == '')
                    return;
                scope.contractDetail.data.budgetedHours = Number(event.target.value).toFixed(2);
                scope.$apply();
            });
        }
    };
});

/**
 * For handling 2dp value for overtime cost
 */
angular.module('redPandaApp').directive('isOvertimeTwodp', function() {
    return {
        require: 'ngModel',
        link: function(scope, element) {
            scope.$watch('EmployeeDetail.data.otCostAmt', function(newValue, oldValue) {
                if (newValue == '' || newValue == null)
                    return;
                var data = String(newValue).split("");
                if (data.length === 0) return;
                if (data.length === 1 && data[0] === '.') return;
                for (var i = 0; i < data.length; i++) {
                    if (data[i] === '.' && data.length - 1 - i > 2) {
                        scope.EmployeeDetail.data.otCostAmt = oldValue;
                    }
                }
                if (isNaN(newValue)) {
                    if (scope.EmployeeDetail == null)
                        return;
                    scope.EmployeeDetail.data.otCostAmt = oldValue;
                }
            });
            element.bind('blur', function(event) {
                var val = event.target.value;
                if (val == '')
                    return;
                scope.EmployeeDetail.data.otCostAmt = Number(event.target.value).toFixed(2);
                scope.$apply();
            });
        }
    };
});

/**
 * Directive for Image file selection.
 * Upload.js module has been used for Image Uploading.
 */
angular.module('redPandaApp').directive("ngFileSelect", function() {
    return {
        link: function($scope, el) {
            el.bind("change", function(e) {
                $scope.file = (e.srcElement || e.target).files[0];
                if ($scope.file != null) {
                    if ($scope.file.type.split('/')[0] != 'image') {
                        $scope.addAlert("Upload valid Image file.", "danger");
                        $scope.$apply();
                        return;
                    }
                    if (($scope.file.size/1024) > 1000) {
                        $scope.addAlert("Image file exceeds maximum area.Please choose a file under 1MB.", "danger");
                        $scope.$apply();
                        return;
                    }
                    $scope.closeAlert();
                    $scope.getFile($scope.file);
                }
            });
        }
    }
});


/**
 * Directive for accpting only numbers in the text box.
 */
angular.module('redPandaApp').directive("numbersOnly", function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function(inputValue) {
                if (inputValue == undefined) return ''
                var inputVal = inputValue.replace(/[^0-9]/g, '');
                if (inputVal != inputValue) {
                    modelCtrl.$setViewValue(inputVal);
                    modelCtrl.$render();
                }

                return inputVal;
            });
        }
    };
});


/**
 * ============================================================================================================
 * AngularJS - Services
 * 1.CurrentTimeStamp
 * 2.FilterDeleted
 * 3.IsoDateFormat
 * 4.USDateFormat
 * ============================================================================================================
 */

/**
 * Angular Service
 * CurrentTimeStamp - Service used to get the timestamp used for posting the data to the server.
 * Will return the TimeStamp in a format needed for updating/deleting the records.
 * yyyy-mm-ddThh:mm:ss.sss+00:00
 */
angular.module('redPandaApp').service('CurrentTimeStamp', function() {
    //Function used to get TimeZone in hh:mm format
    this.postTimeStamp = function() {
        var d = new Date();
        var getTimeZone = function(minsDayLight) {
            var hh = "00",
                mm = "00";
            isNegative = false;
            hh = Math.floor(minsDayLight / 60);
            //For Negative values	             
            if (hh < 0) {
                hh = -(hh);
                isNegative = true;
            }
            if (hh < 9)
                hh = "0" + hh;

            mm = Math.floor(minsDayLight % 60);
            //For Negative values
            if (mm < 0)
                mm = -(mm);
            if (mm < 9)
                mm = "0" + mm;

            if (isNegative)
                return "-" + (hh + ":" + mm);
            else
                return "+" + hh + ":" + mm;
        };

        //Function used to format time in 2dp
        var formatTime = function(time) {
                var tMs = "";
                if (time.toString().length == 1)
                    tMs = "0" + time;
                else
                    tMs = time.toString();
                return tMs;
            }
            //Function used to get Milliseconds in 3dp
        var getMilliSecond = function() {
            var tMs = "";
            var ms = d.getMilliseconds();
            if (ms == '' || ms == null) {
                tMs = "000";
                return tMs;
            }
            if (ms.toString().length == 2)
                tMs = "0" + ms;
            else if (ms.toString().length == 1)
                tMs = "00" + ms;
            else
                tMs = ms.toString();
            return tMs;
        }
        var postTime = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + "T" + formatTime(d.getHours()) + ":" + formatTime(d.getMinutes()) + ":" + formatTime(d.getSeconds()) + "." + getMilliSecond() + "" + (getTimeZone(-(d.getTimezoneOffset())));
        return postTime;
    }
});

/**
 * Service to filter the deleted record from the list.
 */
angular.module('redPandaApp').service('FilterDeleted', function() {

    this.filter = function(tableList) {
        var activeList = [];
        var deletedList = []
        if (typeof tableList !== 'undefined' && tableList.length > 0) {

            for (var i = 0; i < tableList.length; i++) {
                if (tableList[i].deleted) {
                    tableList.splice([i], 1);
                } else {
                    activeList.push(tableList[i])
                }
            }
            return activeList;
        }
    }
});

/**
 * Conversion of mm-dd-yyy format to ISO format
 * Uses moment.js - Since new date() is not supported in some major browsers, library called moment.js is 
 * used.
 */
angular.module('redPandaApp').service('IsoDateFormat', function() {
    this.convert = function(value) {
    	console.log(value);
        var selectedDate = moment(value,"MM-DD-YY");
        console.log(selectedDate);
        var year = selectedDate.year();
        var month = (selectedDate.month() + 1).toString().length == 1 ? "0" + (selectedDate.month() + 1) : (selectedDate.month() + 1);
        var date = selectedDate.date().toString().length == 1 ? "0" + (selectedDate.date()) : (selectedDate.date());
        var ISODate = year + "-" + month + "-" + date;
        return ISODate;
    }
});
/**
 * Conversion of mm-dd-yyy format to ISO format
 */
angular.module('redPandaApp').service('USDateFormat', function() {

    /**
     * @param {{String}}value
     * @param {{boolean}} isSlash - Whether slash format is needed
     */
    this.convert = function(value, isSlash) {
        var newDate = moment(value);
        var month = (newDate.month() + 1).toString().length == 1 ? "0" + (newDate.month() + 1) : newDate.month() + 1;
        var date = (newDate.date().toString().length) == 1 ? "0" + (newDate.date()) : newDate.date();
        var year = newDate.year().toString().substring(2,4);
        if (isSlash != null)
            var USDate = month + "/" + date + "/" + year;
        else
            var USDate = month + "-" + date + "-" + year;
        return USDate;
    }
});
angular.module('redPandaApp').service('UserComments', function() {

	var ordinal_suffix_of = function(i) {
			var j = i % 10,
				k = i % 100;
			if (j == 1 && k != 11) {
				return i + "st";
			}
			if (j == 2 && k != 12) {
				return i + "nd";
			}
			if (j == 3 && k != 13) {
				return i + "rd";
			}
			return i + "th";
		}
	this.convertCommentDate = function(date){	
		if (date == '')
			return;
		var SecondsPerMinute = 60;
		var MinutesPerHour = 60;
		var SecondsPerHour = MinutesPerHour * SecondsPerMinute;
		var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
		var months = [ "January", "February", "March", "April", "May", "June",
						"July", "August", "September", "October", "November", "December" ];
		var comment_date = new Date(date);
		var hours = comment_date.getHours();
		var minutes = comment_date.getMinutes();
		var meridiem = hours >= 12 ? 'pm' : 'am';
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		hours = hours < 10 ? '0'+ hours : hours;
		minutes = minutes < 10 ? '0'+ minutes : minutes;
		var day_date = comment_date.getDate();
		day_date = ordinal_suffix_of(day_date);
		var comment_time = comment_date.getTime();
		var current_date = new Date();
		var current_time = current_date.getTime();
		var diff = Math.floor((current_time - comment_time)/1000);
		if (diff < 1 * MinutesPerHour)
		{
		  return diff <= 1 ? "one second ago" : diff + " seconds ago";
		}
		if (diff < 2 * MinutesPerHour)
		{
		  return "a minute ago";
		}
		if (diff < 45 * MinutesPerHour)
		{
		  return Math.floor(diff/60) + " minutes ago";
		}
		if (diff < 90 * MinutesPerHour)
		{
		  return "an hour ago";
		}
		if (diff < 24 * SecondsPerHour)
		{
		  return Math.floor(diff/3600) + " hours ago";
		}
		if (diff < 48 * SecondsPerHour)
		{
		  return "yesterday";
		}
		else 
		{
		  return days[comment_date.getDay()]+" "+months[comment_date.getMonth()]+" "+day_date+" at "+hours+":"+minutes+""+meridiem;
		}
	}

    this.formatInputData = function(comments) {
        var formatdata = this.convertCommentDate;
        if (comments == null || comments.length === 0) {
            comments = [];
        } else {
           
            angular.forEach(comments, function(data, key) {
                
                if (data.postedOn != null)
                   data['tempTime'] = formatdata(data.postedOn);
                if (data.postedBy != null) {
                    if (data.postedBy['thumbUrl'] == null || data.postedBy['thumbUrl'] == "")
                        data.postedBy['thumbUrl'] = $rootScope.defaultUserImage;
                }
            });
        }
        return comments;
    }

    this.filterPostData = function(obj) {
        if (obj.length > 0) {
            angular.forEach(obj, function(data, key) {
                if (data.tempTime != null)
                    delete data.tempTime;
                if (data.postedBy != null) {
                    if (data.postedBy.thumbUrl)
                        delete data.postedBy.thumbUrl;
                    if (data.postedBy.name)
                        delete data.postedBy.name;
                }
            });
        }
        return obj;
    }
	});


