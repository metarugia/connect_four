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

    /***************** CONSTANTS ******************/

    const RED = 'red';
    const YELLOW = 'yellow';
    const WHITE = 'white';
    const ROWS = 6;
    const COLUMNS = 7;

    /***************** $scope variables ******************/

    $scope.gameOverMessage = '';
    $scope.gameOver = false;
    $scope.numColumns = [];
    $scope.numRows = [];

    /***************** variables *****************/

    var playerTurn = RED;
    var board = new Array();
    var aiOn = true;
    var turnCount = 0;

    /***************** board setup *****************/

    for(var i = 0; i < ROWS; i++) {
      board[i] = new Array();
      for(var j = 0; j < COLUMNS; j++) {
        board[i][j] = WHITE;
      }
    }

    for(var i = 0; i < ROWS; i++) {
      $scope.numRows.push(ROWS);
    }

    for(var i = 0; i < COLUMNS; i++) {
      $scope.numColumns.push(ROWS - 1);
    }

    /***************** functions *****************/


    /**
     * Drops a player piece into the connect four board.
     * @param index
     */

    $scope.dropPiece = function(index) {
      if(minimaxService.canMove(board,index)) {
        var columnName = "column" + index;
        var rowPosition = $scope.numColumns[index];
        var column = document.getElementById(columnName);

        column.getElementsByTagName("circle")[rowPosition].style.fill = playerTurn;
        board[rowPosition][index] = playerTurn;
        turnCount++;
        if(minimaxService.checkBoardForWin(board, playerTurn)) {
          if(playerTurn === RED)
            $scope.gameOverMessage = 'RED WINS!!!';
          else $scope.gameOverMessage = 'YELLOW WINS!!!';
          $scope.gameOver = true;
          document.getElementById("game-board").className += " unclickable";
        }
        else if(minimaxService.checkBoardForDraw(board)) {
          $scope.gameOverMessage = 'DRAW!!!';
          $scope.gameOver=true;
        }
        else {
          $scope.numColumns[index]--;
          nextPlayer();
          if(aiOn === true)
            aiDropPiece();
        }

      }
    }

    /**
     * Calls the minimax function to determine best column for the ai
     * to drop a piece in.
     */

    var aiDropPiece = function() {
      var index = 0;
      if(turnCount <= 1) {
        index = 3;
      }
      else {
        index = minimaxService.alphabeta(board, playerTurn, 0,-100000000, 100000000);
        //index = minimaxService.minimax(board, playerTurn, 0);
      }
      if(minimaxService.canMove(board,index)) {
        var columnName = "column" + index;
        var rowPosition = $scope.numColumns[index];
        var column = document.getElementById(columnName);

        column.getElementsByTagName("circle")[rowPosition].style.fill = playerTurn;
        board[rowPosition][index] = playerTurn;
        turnCount++;
        if(minimaxService.checkBoardForWin(board, playerTurn)) {
          if(playerTurn === RED)
            $scope.gameOverMessage = 'RED WINS!!!';
          else $scope.gameOverMessage = 'YELLOW WINS!!!';
          $scope.gameOver = true;
          document.getElementById("game-board").className += " unclickable";
        }
        else if(minimaxService.checkBoardForDraw(board)) {
          $scope.gameOverMessage = 'DRAW!!!';
          $scope.gameOver=true;
        }
        else {
          $scope.numColumns[index]--;
          nextPlayer();
        }

      }
    }

    /**
     * Switches turn to other player.
     */

    var nextPlayer = function() {
      if(playerTurn === YELLOW)
        playerTurn = RED;
      else
        playerTurn = YELLOW;
    }

    /*=================================================================================================================*/



  });
