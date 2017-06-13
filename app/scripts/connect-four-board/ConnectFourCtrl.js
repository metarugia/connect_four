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

    for(var i = 0; i < ROWS; i++) {
      $scope.board[i] = new Array();
      for(var j = 0; j < COLUMNS; j++) {
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
        var rowPosition = $scope.numColumns[index];
        var column = document.getElementById(columnName);

        column.getElementsByTagName("circle")[rowPosition].style.fill = $scope.playerTurn;
        $scope.board[rowPosition][index] = $scope.playerTurn;
        if($scope.checkForWin(rowPosition, index))
          console.log($scope.playerTurn + ' WINS!!!!');
        $scope.numColumns[index]--;
        $scope.nextPlayer();
      }
    }

    $scope.printBoard = function() {
      var board = '| ';
      for(var i = 0; i < ROWS; i++) {
        for(var j = 0; j < COLUMNS; j++) {
          board += $scope.board[i][j] + ' | ';
        }
        board += '\n| ';
      }
      console.log(board);
    }

    $scope.canMove = function(index)
    {
      if($scope.numColumns[index] < 0) {
        return false;
      }
      return true;
    }

    $scope.checkForWin = function(row, column) {
      var numConnected = 1;
      var directions = [[1,1], [-1,-1], [1,-1], [-1,1], [1,0], [0,1], [-1,0], [0,-1]];
      var currentPiece = $scope.board[row][column];
      for(var k = 0; k < directions.length; k++) {
        for (var i = row + directions[k][0], j = column + directions[k][1]; i < ROWS && j < COLUMNS &&
              i >=0 && j >=0 && numConnected < 4; i+= directions[k][0], j+= directions[k][1]) {
          if ($scope.board[i][j] !== currentPiece) {
            break;
          }
          numConnected++;
        }

        if (numConnected === 4)
          return true;

        numConnected = 1;
      }

      return false;
    }

  });
