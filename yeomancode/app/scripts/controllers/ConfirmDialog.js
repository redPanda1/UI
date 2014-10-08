/**
 * Controller for the Pop-up. Used for handling the user action in the pop up.
 * @param $scope
 * @param $modalInstance
 */
angular.module('redPandaApp').controller('modalcontroller', ['$scope', '$rootScope',
function($scope,$rootScope) {

	
    $scope.ok = function() {
        $rootScope.dialogModal.close();
    }

    /**
     * Function used to perform the specified action when cancel
     * button is clicked.
     */
    $scope.cancel = function() {
        $rootScope.dialogModal.dismiss('dismiss');
    }
}]);

