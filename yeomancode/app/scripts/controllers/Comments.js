/**
 * Controller adding and populating the comments in the detail page
 * @param $scope
 * @param $rootScope
 * @param UserComments
 */
angular.module('redPandaApp').controller('commentsController', ['$scope', '$rootScope', 'UserComments',
    function($scope, $rootScope, UserComments) {

         $scope.$watch('detailComments.comments', function(nValue, oValue) {
            if (nValue == null)
                    return
            $scope.detailComments.comments = $scope.detailComments.comments;             
        }, true);

        /**
         * For saving live comments
         */
        $scope.saveCommentMessage = function() {
            if ($scope.commentText === "")
                return;
            var currentdate = new Date();
            var currentISO = currentdate.toISOString();
            var text = $scope.commentText;
            $scope.commentText = "";
            if ($scope.detailComments.comments == null)
                $scope.detailComments.comments = []
            var seq = 0,
                len = $scope.detailComments.comments.length;
            if (len === 0) {
                seq = 0;
            } else {
                seq = len;
            }
            $scope.detailComments.comments.push({
                "seqNo": seq,
                "postedBy": {
                    "thumbUrl": $rootScope.defaultUserImage,
                    "name": $rootScope.currentUserName,
                    "id": $rootScope.currentUserId
                },
                "postedOn": currentISO,
                "replyTo": 0,
                "docRef": 0,
                "text": text
            });
            angular.forEach($scope.detailComments.comments, function(data, key) {
                if (data.postedOn != null)
                    data['tempTime'] = UserComments.convertCommentDate(data.postedOn)
            });            
        }

    }
]);