'use strict';

/**
 * @ngdoc directive
 * @name redPandaApp.directive:downloadReport
 * @description
 * # downloadReport
 */
angular.module('redPandaApp')
  .directive('downloadReport', function () {
     return {
	    restrict: 'A',	   
        scope:{
			isDownloadCreator	: '=' ,
			saveas				: '='
        },
        link: function(scope) {
            scope.$watch('isDownloadCreator', function(nValue, oValue) {
                if (nValue == true) {

                    if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
                        alert('Download functions have been temporarily disabled in Safari due to an browser issue.  Waiting for issue resolution from Apple.  Please switch to Firefox or Chrome for use of the download function.');
                        scope.isDownloadCreator = false;
                    } else {
                        var blob = new Blob([angular.element('#exportable').html()], {
                            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
                        });
                        saveAs(blob, scope.saveas);
                        scope.isDownloadCreator = false;
                    }

                }
            });
        }
    }
});