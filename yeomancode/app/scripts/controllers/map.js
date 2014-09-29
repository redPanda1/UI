/**
 * mapController - Controller for drawing maps
 * @param $scope
 * @param $cookieStore 
 */
angular.module('redPandaApp').controller('mapController', ['$scope','$cookieStore', 
	function($scope,$cookieStore){

    /**
     * =============================================================================
     * Watcher function whether the map API needs to called.
     * =============================================================================
     */    
    $scope.$watch('needMapCall.callMap', function(nValue, oValue) {
        if (nValue == null)
            return;
        if (nValue == true) {
            $scope.geocoding();
            $scope.needMapCall.callMap = false;
        }

    }, true);

    /**
     * =============================================================================
     * Google Map - Options for displaying the map in the contacts info.
     * =============================================================================
     */
    $scope.geocoding = function() {
        var geocoder = new google.maps.Geocoder();
        if ($scope.mapOptions == null)
            return;

        if ($scope.mapOptions.data[$scope.addressKeys[0]] != null)
            $scope.street = $scope.mapOptions.data[$scope.addressKeys[0]];
        else
            $scope.street = "";

        if ($scope.mapOptions.data[$scope.addressKeys[1]] != null)
            $scope.city = $scope.mapOptions.data[$scope.addressKeys[1]];
        else
            $scope.city = "";

        if ($scope.mapOptions.data[$scope.addressKeys[3]] != null)
            $scope.zip = $scope.mapOptions.data[$scope.addressKeys[3]];
        else
            $scope.zip = "";


        if ($scope.mapOptions.data[$scope.addressKeys[2]] != null) {
            if (typeof($scope.mapOptions.data[$scope.addressKeys[2]]) == 'object')
                $scope.state = $scope.mapOptions.data[$scope.addressKeys[2]].name;
            else
                $scope.state = $scope.mapOptions.data[$scope.addressKeys[2]];
        } else {
            $scope.state = "";
        }

        if ($scope.mapOptions.data[$scope.addressKeys[4]] != null) {
            if (typeof($scope.mapOptions.data[$scope.addressKeys[4]]) == 'object')
                $scope.country = $scope.mapOptions.data[$scope.addressKeys[4]].name;
            else
                $scope.country = $scope.mapOptions.data[$scope.addressKeys[4]];
        } else {
            $scope.country = "";
        }
        /**
        * =============================================================================
        * Posting the address details of the user entered value to the Google map API
        * =============================================================================
        */
        var mapAddress =$scope.country+","+$scope.state+","+$scope.zip+","+$scope.city+","+$scope.street; 
        geocoder.geocode({
            'address': mapAddress,
            'region' : $scope.country
        }, function(results, status) {

            var latLong = [];
            if (status == google.maps.GeocoderStatus.OK) {
                var position = results[0].geometry.location;
                for (k in position) {
                    if (position.hasOwnProperty(k))
                        latLong.push(position[k])
                }
                $scope.map = {
                    center: {
                        latitude: latLong[0],
                        longitude: latLong[1]
                    },
                    zoom: 11
                };

                $scope.marker = {
                    center: {
                        latitude: latLong[0],
                        longitude: latLong[1]
                    }
                }

                if (!$scope.$$phase) {
                    $scope.$apply();
                    $scope.mapOptions.data.addressLat = latLong[0];
                    $scope.mapOptions.data.addressLong = latLong[1];
                }
            }
        });
    }

    //Setting Map Center Position
    $scope.map = {
        center: {
            latitude: 40.0000, 
            longitude: -74.5000 
        },
        zoom: 2
    };

    //Setting Marker position based on the mode i.e create mode or update mode
     $scope.marker = {
            center: {
                latitude: 40.0000,
                longitude: -74.5000
            }
     }
}]);
