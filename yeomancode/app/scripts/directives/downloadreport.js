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
				scope.$watch('isDownloadCreator',function(nValue,oValue)
				{
					if(nValue == true)
					{
						console.log(navigator.userAgent);
						console.log(navigator.userAgent.search("Safari"));
						console.log(navigator.userAgent.search("Chrome"));
						if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) 
						{
                             var content = angular.element('#exportable').html().toString();
                             var uriContent = "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8,"+encodeURIComponent(content);
                             var anchorElement = document.createElement('a');
                             anchorElement.setAttribute('href', 'data:text/plain;charset=utf-8,' + uriContent);
                             anchorElement.setAttribute('download', scope.saveas);
                             anchorElement.setAttribute('target', '_blank');
                             anchorElement.click();
                             scope.isDownloadCreator = false;
						}
						else
						{
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

