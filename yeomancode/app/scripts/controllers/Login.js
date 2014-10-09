/**
 * LoginController - Controller used for Login Page
 * @param $scope
 * @param $location
 * @param $http
 * @param $window
 */
angular.module('redPandaApp').controller('LoginController', ['$scope','$location','$http','$window','$rootScope','$cookieStore',
function($scope,$location,$http,$window, $rootScope,$cookieStore)
{
	$scope.alerts = [];
	$scope.userName = "";
	$window.scrollTo(0,0);
	$cookieStore.put("enableApplication",false);
	$rootScope.showApplication    = $cookieStore.get("enableApplication");

	$scope.forgetPassword = function() {
		$location.path('/ResetPassword');
	}

	$scope.signUp = function() {
		$location.path('/Registration');
	}

	/**
	 *Function used to add alerts in the Login Page
	 *@param message
	 *@param type
	 *@param header
	 */
	$scope.addAlert = function(message, type, header) {
		$scope.alerts = [];
		$scope.alerts.push( {
			"message" : message,
			"type" : type
		});
		$window.scrollTo(0, 0);
	}

	/**
	 * Function used to close alerts in the Login page
	 */
	$scope.closeAlert = function() {
		$scope.alerts = [];
	}

	/**
     * Function used to construct query parameters
     *
     */
    $scope.constructQueryParameters = function()
    {          
          var str = "";
          if($scope.userId != null && $scope.userId != "")
             str += "userID="+$scope.userId;
          if($scope.password != null && $scope.password != "")
             str += "&password="+$scope.password;               
          return str;   
    }



	/**
	 * Function used to perform login 
	 * @param provider
	 */
	$scope.loginUser = function(provider) {
		$scope.postData = "";
		if (provider == null) {
			console.log("inside login");

			if ($scope.userId == null || $scope.userId == "") {
				$scope.addAlert('Please Enter a user name or email', 'danger');
				return;
			}

			$scope.closeAlert();

			if ($scope.password == null || $scope.password == "") {
				$scope.addAlert('Please Enter a  Password', 'danger');
				return;
			}
			$scope.closeAlert();	
			var formattedData = $scope.constructQueryParameters();
			$scope.sendGetRequest(null,formattedData);
			
		} else {
			//Provider
			var formattedData = $scope.constructQueryParameters();
			$scope.sendGetRequest(provider,formattedData);	
		}
	}

	$scope.sendGetRequest = function(providerName,formattedData)
	{
		if(providerName != null)
		{
			console.log("/api/login?provider="+providerName+"&"+formattedData);
           if(formattedData == "")
              $window.open("/api/login?provider="+providerName);
           else
              $window.open("/api/login?provider="+providerName+"&"+formattedData);
           
		}
		else
		{
			console.log("/api/login?"+formattedData);
            $http({
               "method": "get",
               "url": "/api/login?"+formattedData
            }).success(function(data){ 
               //Current user id                
               $cookieStore.put("currentUserId",data.data.contactId);
               $rootScope.currentUserId = $cookieStore.get("currentUserId");
               //current user name 
               $cookieStore.put("currentUserName",data.data.userName);
               $rootScope.currentUserName = $cookieStore.get("currentUserName");
               //Current image
               $cookieStore.put("defaultUserImage",data.data.themeIconUrl);
               $rootScope.defaultUserImage = $cookieStore.get("defaultUserImage");
               console.log("Success");
               if(data.success == true)
               	 $location.path('/Home');
               else
               	 $scope.addAlert('Login Error.There was an error with the credential supplied,please try again','danger');
            }).error(function(data, status){
               console.log("Error");
               $scope.addAlert('Login Error.There was an error with the credential supplied,please try again','danger');
               /*var data = $rootScope.login.data;
               console.log(data)
               $cookieStore.put("currentUserId",data.companyId);
               $rootScope.currentUserId = $cookieStore.get("currentUserId");
               //current user name 
               $cookieStore.put("currentUserName",data.userName);
               $rootScope.currentUserName = $cookieStore.get("currentUserName");
               //Current image
               $cookieStore.put("defaultUserImage",data.themeIconUrl);
               $rootScope.defaultUserImage = $cookieStore.get("defaultUserImage");*/

            });
		}
	}

}]);

