'use strict';

/**
 * @ngdoc function
 * @name redPandaApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the redPandaApp
 */
angular.module('redPandaApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
