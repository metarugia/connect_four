'use strict';

/**
 * @ngdoc function
 * @name connectFourApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the connectFourApp
 */
angular.module('connectFourApp')
  .controller('ConnectFourCtrl', function ($scope) {
    const RED = 'red';
    const YELLOW = 'yellow';
    const EMPTY = 'white';
    const ROWS = 6;
    const COLUMNS = 7;

    $scope.numColumns = [];
    $scope.numRows = [];
    $scope.board = new Array();

    for(var i = 0; i < COLUMNS; i++) {
      $scope.board[i] = new Array();
      for(var j = 0; j < ROWS; j++) {
        $scope.board[i][j] = EMPTY;
      }
    }

    for(var i = 0; i < ROWS; i++) {
      $scope.numRows.push(ROWS);
    }

    for(var i = 0; i < COLUMNS; i++) {
      $scope.numColumns.push(ROWS - 1);
    }

    $scope.playerTurn = RED;
    $scope.nextPlayer = function() {
      if($scope.playerTurn === YELLOW)
        $scope.playerTurn = RED;
      else
        $scope.playerTurn = YELLOW;
    }

    $scope.dropPiece = function(index) {
      if($scope.canMove(index)) {
        var columnName = "column" + index;
        var column = document.getElementById(columnName);
        column.getElementsByTagName("circle")[$scope.numColumns[index]].style.fill = $scope.playerTurn;
        $scope.numColumns[index]--;
        $scope.nextPlayer();
      }
    }

    $scope.canMove = function(index)
    {
      if($scope.numColumns[index] < 0) {
        return false;
      }
      return true;
    }

  });
