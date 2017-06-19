'use strict';

/**
 * @ngdoc function
 * @name connectFourApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the connectFourApp
 */
angular.module('connectFourApp')
  .controller('ConnectFourCtrl',function ($scope, minimaxService) {
    const RED = 'red';
    const YELLOW = 'yellow';
    const EMPTY = 'white';
    const ROWS = 6;
    const COLUMNS = 7;

    //order is N, NE, E, SE, S, SW, W, NW
    const DIRECTIONS = [[-1,0], [-1,1], [0,1], [1,1], [1,0], [1, -1], [0,-1], [-1,-1]];

    $scope.playerTurn = RED;
    $scope.gameOverMessage = '';
    $scope.gameOver = false;
    $scope.numColumns = [];
    $scope.numRows = [];
    $scope.board = new Array();
    $scope.aiOn = true;
    $scope.turnCount = 0;


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
        $scope.turnCount++;
        if($scope.checkForWin(rowPosition, index)) {
          if($scope.playerTurn === RED)
            $scope.gameOverMessage = 'RED WINS!!!';
          else $scope.gameOverMessage = 'YELLOW WINS!!!';
          $scope.gameOver = true;
          document.getElementById("game-board").className += " unclickable";
        }
        else if(minimaxService.checkBoardForDraw($scope.board)) {
          $scope.gameOverMessage = 'DRAW!!!';
          $scope.gameOver=true;
        }
        else {
          $scope.numColumns[index]--;
          $scope.nextPlayer();
          if($scope.aiOn === true)
            $scope.aiDropPiece();
        }

      }
    }

    $scope.aiDropPiece = function() {
      var index = 0;
      console.log('aimoving');
      if($scope.turnCount <= 1) {
        index = 3;
      }
      else {
        index = minimaxService.alphabeta($scope.board, $scope.playerTurn, 0,-100000000, 100000000);
        //index = minimaxService.minimax($scope.board, $scope.playerTurn, 0);
      }
       console.log(index);
      if($scope.canMove(index)) {
        var columnName = "column" + index;
        var rowPosition = $scope.numColumns[index];
        var column = document.getElementById(columnName);

        column.getElementsByTagName("circle")[rowPosition].style.fill = $scope.playerTurn;
        $scope.board[rowPosition][index] = $scope.playerTurn;
        $scope.turnCount++;
        if($scope.checkForWin(rowPosition, index)) {
          if($scope.playerTurn === RED)
            $scope.gameOverMessage = 'RED WINS!!!';
          else $scope.gameOverMessage = 'YELLOW WINS!!!';
          $scope.gameOver = true;
          document.getElementById("game-board").className += " unclickable";
        }
        else if(minimaxService.checkBoardForDraw($scope.board)) {
          $scope.gameOverMessage = 'DRAW!!!';
          $scope.gameOver=true;
        }
        else {
          $scope.numColumns[index]--;
          $scope.nextPlayer();
        }

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
      return board;
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
      for(var k = 0; k < DIRECTIONS.length; k++) {
        numConnected = $scope.checkDirection(row, column, k, numConnected);
        if(numConnected === 4)
          return true;

        //check opposite direction in case this new piece was a middle piece
        numConnected = $scope.checkDirection(row, column, (k+4)%8, numConnected);
        if(numConnected === 4)
          return true;
        numConnected = 1;
      }

      return false;
    }

    $scope.checkDirection = function(row, column, dir, numConnected) {
      var currentPiece = $scope.board[row][column];
      for (var i = row + DIRECTIONS[dir][0], j = column + DIRECTIONS[dir][1]; i < ROWS && j < COLUMNS &&
      i >=0 && j >=0 && numConnected < 4; i+= DIRECTIONS[dir][0], j+= DIRECTIONS[dir][1]) {
        if ($scope.board[i][j] !== currentPiece) {
          break;
        }
        numConnected++;
      }

      return numConnected;

    }
    $( document ).ready(function() {
      //$scope.aiDropPiece();
    });

    /*=================================================================================================================*/



  });
