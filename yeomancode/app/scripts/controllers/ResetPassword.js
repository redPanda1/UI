angular.module('redPandaApp').controller('ResetPasswordController', ['$scope', '$location','$timeout','$http','$window','$rootScope',
function($scope,$location,$timeout,$http,$window,$rootScope) {

	$scope.alerts = [];
	$scope.userEmail = "";
	$window.scrollTo(0,0);
	

	$scope.signUp = function(row) {
		$location.path('/Registration');
	}

	$scope.login = function(row) {
		$location.path('/login');
	}

	/**
	 * Function used to add alerts in the Reset password page
	 * @param {{string}} message
	 */
	$scope.addAlert = function(message, type, header) {
        console.log("Add alerts");
		$scope.alerts = [];
		$scope.alerts.push( {
			"message" : message,
			"type" : type
		});
		$window.scrollTo(0, 0);
	}
	
	/**
	 * Function used to close alerts in the reset password page
	 */
	$scope.closeAlert = function() {
		$scope.alerts = [];
	}

	/**
	 * Function used to validate the email
	 */
	$scope.validateEmail = function() {
		var email_regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (!email_regex.test($scope.userEmail)) {
			$scope.addAlert('Please Enter a Valid Email Id', 'danger');
			return true;
		} else
			return false;

	}
	
	/**
	 * Function used to perform reset password 
	 * @param provider
	 */
	$scope.resetPassword = function(provider) {
		$scope.postData = "";
		if ($scope.userEmail == null || $scope.userEmail == "") {
			$scope.addAlert('Please Enter Valid email','danger');
			return;
		}
		if($scope.userEmail != null && $scope.userEmail != "")
		{
			if($scope.validateEmail())
				return;
		}
		$scope.closeAlert();		

		/**
		 * GET Requests for /api/register
		 */
		$http({
			"method" : "get",
			"url" : "/api/login/password?email="+$scope.userEmail
		}).success(function(data) {
			console.log('Success');
			if(data.success == true)
            {
                console.log("In password reset");
                $scope.addAlert("Your password has been successfully reset and a mail has been sent with your new credentials. Please ensure that mails from www.redPandaApp.com are not being filtered to your junk folder.","success");
                $timeout(function() {
                    $location.path('/login');
                }, 5000);
            }
			else
				$scope.addAlert('Login Error.There was an error with the credential supplied,please try again','danger');
		}).error(function(data, status) {
			console.log('Error');
			$scope.addAlert('Login Error.There was an error with the credential supplied,please try again','danger');
		});

	}
}]);

