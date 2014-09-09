'use strict';

/**
 * @ngdoc function
 * @name redPandaApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the redPandaApp
 */
angular.module('redPandaApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
