angular.module('redPandaApp').controller('LoginRegistrationController', ['$scope','$location','$timeout','$http','$window','$rootScope',
function($scope,$location,$timeout,$http,$window,$rootScope)
{
	 $scope.alerts = [];
	 $scope.regName = "";
	 $scope.regEmail ="";
     $scope.termsConditions = false;
     $scope.isMobile= false;
	 $window.scrollTo(0,0);
	 
	/**
	 * Function used to navigating to reset password page 
	 */
	 $scope.forgetPassword = function(row) {
      $location.path('/ResetPassword');
     }
    
     /**
      * Function used to login page
      */
      $scope.login = function(row) {
		  $location.path('/login');
       }
       
      /**
       * Displaying validation alert
       */
      $scope.addAlert = function(message,type)
      {
          console.log("inside alert");
    	  $scope.alerts = [];
    	  $scope.alerts.push({
              "message": message,
              "type": type
          });
          $window.scrollTo(0, 0);
      }
      
      /**
       * 
       */
      $scope.closeAlert = function()
      {
    	  $scope.alerts = [];
      }
      
      /**
       * Function used to validate the email
       */
      $scope.validateEmail = function()
      {
    	  var email_regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; 
    	  if (!email_regex.test($scope.regEmail)) 
    	  {
			$scope.addAlert('Please Enter a Valid Email Id','danger');
    		return true;
          }
    	  else
    		 return false;  
    		
      }
      
      /**
       * Function used to construct query parameters
       *
       */
       $scope.constructQueryParameters = function(isIp,data)
       {          
              var str = "";
              if($scope.regName != null && $scope.regName != "")
                 str += "name="+$scope.regName;
              if($scope.regEmail != null && $scope.regEmail != "")
                 str += "&email="+$scope.regEmail;
              if($scope.regCompName != null && $scope.regCompName != "" )
                 str += "&companyName="+$scope.regCompName;
              if($scope.regPreUrl != null && $scope.regPreUrl != "")
                 str += "&url="+$scope.regPreUrl
              if($scope.isMobile != null && $scope.isMobile != "")
                  str +="&isMobile="+$scope.isMobile;    
              if(isIp) 
              {
                 if(data.city != null)
                   str +="&city="+data.city;
                 if(data.region != null)
                   str +="&region="+data.region;
                 if(data.country != null)
                   str +="&countryISO="+data.country;
                 if(data.loc != null)
                 {
                   str +="&lat="+data.loc.split(',')[0];
                   str +="&long="+data.loc.split(',')[1];
                 }
              }
              return str;   
       }



      /**
       * Function used to get the ip information
       * @param isProvider
       */
      $scope.userInformation = function(isProvider,providerName)
      {

        $http({
                "method": "get",
                "url": "http://ipinfo.io/json"
        }).success(function(data){ 
                var ipData = data;                
                var formattedData = $scope.constructQueryParameters(true,ipData)
                if(isProvider)
                    $scope.sendPostRequest(providerName,formattedData);
                else
                    $scope.sendPostRequest(null,formattedData);
        }).error(function(data, status){
                var formattedData = $scope.constructQueryParameters(false)
                if(isProvider)
                    $scope.sendPostRequest(providerName,formattedData);
                else
                    $scope.sendPostRequest(null,formattedData);
         });
      }
      
      
      /**
       * Function Used to call the register api
       */
      $scope.sendPostRequest = function(providerName,formattedData)
      {
        if(providerName)
        {
           //oAuth Code
           console.log("/api/register?provider="+providerName+"&"+formattedData);
           if(formattedData == "")
              $window.open("/api/register?provider="+providerName);
           else
              $window.open("/api/register?provider="+providerName+"&"+formattedData);
        }
        else
        {
           console.log("/api/register?"+formattedData);
           $http({
               "method": "get",
               "url": "/api/register?"+formattedData
           }).success(function(data){ 
               console.log("Success");
               if(data.success == true)
               {
                   console.log("Alert")
                   $scope.addAlert("You have successfully registered with redPanda. An email with your credentials has been sent to the address provided. Please ensure that mails from www.redPandaApp.com are not being filtered to your junk folder.","success");
                   $timeout(function() {
                       $location.path('/login');
                   }, 5000);
               }
               else
                   $scope.addAlert('Login Error.There was an error with the credential supplied,please try again','danger');
           }).error(function(data, status){
               console.log("Error");
               $scope.addAlert('Login Error.There was an error with the credential supplied,please try again','danger');
           });
        }
      	 
      	
      }
      
    	
      /**
       * Function used to create Account by validating username and email
       * @param {{String}} provider
       */
      $scope.createAccount = function(provider)
      {
    	
      	if(provider == null)
      	{

      		    if($scope.regName == null || $scope.regName == "")
            	{
            		$scope.addAlert('Please Enter a Name','danger');
            		return;
            	}
            	$scope.closeAlert();
            	
            	if($scope.regEmail == null || $scope.regEmail == "")
            	{
            		$scope.addAlert('Please Enter a Email Id','danger');
            		return;
            	}
            	else
            	{
            		if($scope.validateEmail())
            			return;
            	}
              if(!$scope.termsConditions)
              {
                $scope.addAlert('Please agree to Terms of Use','danger');
                return;
              } 
            	$scope.closeAlert();
            	$scope.userInformation(false,null);
      	}
      	else 
      	{
      		/*if($scope.regEmail != null && $scope.regEmail != "")
      		  {
      			if($scope.validateEmail())
                                    			return;
      		  }*/
                $scope.closeAlert();
                $scope.userInformation(true,provider);
      	}
    	
      }

}]);
