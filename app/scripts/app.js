'use strict';

/**
 * @ngdoc overview
 * @name connectFourApp
 * @description
 * # connectFourApp
 *
 * Main module of the application.
 */
angular
  .module('connectFourApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider, $locationProvider) {

    $locationProvider.hashPrefix('');

    $routeProvider
      .when('/', {
        templateUrl: 'scripts/connect-four-board/connect-four-board.html',
        controller: 'ConnectFourCtrl',
        controllerAs: 'connect-four'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
