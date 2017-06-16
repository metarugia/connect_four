'use strict';

/**
 * @ngdoc function
 * @name connectFourApp.service:MinimaxService
 * @description
 * # minimaxService
 */
angular.module('connectFourApp')
  .service('minimaxService', function () {
    //Directions are N, NE, E, NW
    const DIRECTIONS = [[-1, 0], [-1, 1], [0, 1], [-1, -1]];
    const WHITE = 'white';
    const RED = 'red';
    const YELLOW = 'yellow';
    const ROWS = 6;
    const COLUMNS = 7;
    const TWOIN = 10;
    const THREEIN = 1000;
    const WIN = 10000;
    const DEPTH = 4;


    this.minimax = function(board, row, column, player, depth) {
      var minimax = 0;
      var isOtherPlayer = 1;
      var curPlayer = player;
      if(depth%2 === 0) {
        curPlayer = this.otherPlayer(player);
        isOtherPlayer = -1
      }
      if(depth === DEPTH) {
        minimax = this.evaluate(board, row, column, player)*isOtherPlayer;
        return minimax;
      }

      var newBoard = [];
      var boardValue = this.evaluate(board, row, column, curPlayer)*isOtherPlayer;
      var childValue = 0;
      var bestPath = 0;
      for(var i = 0; i < COLUMNS; i++) {
        newBoard = this.dropPiece(board, i, curPlayer);
        if(newBoard === -1)
          continue;


        childValue = this.minimax(newBoard[0], newBoard[1], i, curPlayer,depth + 1);

        if(isOtherPlayer === 1) {
          if (childValue > minimax) {
            minimax = childValue;
            bestPath = i;
          }
        }
        else {
          if(childValue < minimax) {
            minimax = childValue;
            bestPath = i
          }
        }

      }

      if(depth === 0) {
        return bestPath;
      }

      return minimax + boardValue;

    }

    /**
     * Evaluates the given game state.
     * @param board
     * @param row
     * @param column
     * @param player
     * @returns {number}
     */
    this.evaluate = function (board, row, column, player) {
      var curCol = column;
      var curRow = row;
      var value = 0;

      //Vertical 3 in a row
      if (row > 0
        && row < ROWS - 2
        && board[row + 1][column] === player
        && board[row + 2][column] === player) {
        value += THREEIN;
      }

      //Vertical 2 in a row
      else if (row > 1
        && row < ROWS - 1
        && board[row + 1][column] === player) {
        value += TWOIN;
      }


      //evaluate horizontal
      for (var i = 0; i < 4 && curCol >= 0 && board[row][curCol] !== this.otherPlayer(player); i++) {
        //1100
        if(curCol < COLUMNS - 3) {
          value += this.checkForTwo(board, row, curCol, player, DIRECTIONS[2]);
          value += this.checkForThree(board, row, curCol, player, DIRECTIONS[2]);
        }
        curCol--;

      }
      curCol = column;


      //evaluate NE
      for (var i = 0; i < 4 && curCol >= 0 && curRow <= ROWS - 1 && board[curRow][curCol] !== this.otherPlayer(player); i++) {
        //1100
        if(curCol < COLUMNS - 3 && curRow > 2){
          value += this.checkForTwo(board, curRow, curCol, player, DIRECTIONS[1]);
          value += this.checkForThree(board,curRow, curCol, player, DIRECTIONS[1]);
        }
        curCol--;
        curRow++;
      }
      curCol = column;
      curRow = row;


      //evaluate NW
      for (var i = 0; i < 4 && curCol <= COLUMNS - 1 && curRow <= ROWS - 1 && board[curRow][curCol] !== this.otherPlayer(player); i++) {
        //1100
        if(curCol > 2 && curRow > 2) {
          value += this.checkForTwo(board, curRow, curCol, player, DIRECTIONS[3]);
          value += this.checkForThree(board, row, curCol, player, DIRECTIONS[3]);
        }
        curCol++;
        curRow++;
      }

      return value;
    }

    /**
     * Helper function to evaluate whether exactly two
     * pieces are connected in a position that could lead to
     * a win in successive moves.
     * @param board
     * @param row
     * @param column
     * @param player
     * @param direction
     * @returns the value of this board state for all directions
     * containing two connected pieces
     */
    this.checkForTwo = function(board, row, column, player, direction) {
      var value = 0;
      if (board[row][column] === player
        && board[row + direction[0]][column + direction[1]] === player
        && board[row + direction[0]*2][column + direction[1]*2] === WHITE
        && board[row + direction[0]*3][column + direction[1]*3] === WHITE) {
        value += TWOIN;
      }
      else if (board[row][column] === player
        && board[row + direction[0]][column + direction[1]] === WHITE
        && board[row + direction[0]*2][column + direction[1]*2] === player
        && board[row + direction[0]*3][column + direction[1]*3] === WHITE) {
        value += TWOIN;
      }
      else if (board[row][column] === player
        && board[row + direction[0]][column + direction[1]] === WHITE
        && board[row + direction[0]*2][column + direction[1]*2] === WHITE
        && board[row + direction[0]*3][column + direction[1]*3] === player) {
        value += TWOIN;
      }
      else if (board[row][column] === WHITE
        && board[row + direction[0]][column + direction[1]] === player
        && board[row + direction[0]*2][column + direction[1]*2] === player
        && board[row + direction[0]*3][column + direction[1]*3] === WHITE) {
        value += TWOIN*2;
      }
      else if (board[row][column] === WHITE
        && board[row + direction[0]][column + direction[1]] === player
        && board[row + direction[0]*2][column + direction[1]*2] === WHITE
        && board[row + direction[0]*3][column + direction[1]*3] === player) {
        value += TWOIN;
      }
      else if (board[row][column] === WHITE
        && board[row + direction[0]][column + direction[1]] === WHITE
        && board[row + direction[0]*2][column + direction[1]*2] === player
        && board[row + direction[0]*3][column + direction[1]*3] === player) {
        value += TWOIN;
      }

      return value;
    }

    /**
     * Helper function to evaluate whether exactly three
     * pieces are connected in a position that could lead to
     * a win in successive moves.
     * @param board
     * @param row
     * @param column
     * @param player
     * @param direction
     * @returns the value of this board state for all directions
     * containing three connected pieces
     */
    this.checkForThree = function(board, row, column, player, direction) {
      var value = 0;
      if (board[row][column] === player
        && board[row + direction[0]][column + direction[1]] === player
        && board[row + direction[0]*2][column + direction[1]*2] === player
        && board[row + direction[0]*3][column + direction[1]*3] === WHITE) {
        value += THREEIN;
      }
      else if (board[row][column] === player
        && board[row + direction[0]][column + direction[1]] === WHITE
        && board[row + direction[0]*2][column + direction[1]*2] === player
        && board[row + direction[0]*3][column + direction[1]*3] === player) {
        value += THREEIN;
      }
      else if (board[row][column] === player
        && board[row + direction[0]][column + direction[1]] === player
        && board[row + direction[0]*2][column + direction[1]*2] === WHITE
        && board[row + direction[0]*3][column + direction[1]*3] === player) {
        value += THREEIN;
      }
      else if (board[row][column] === WHITE
        && board[row + direction[0]][column + direction[1]] === player
        && board[row + direction[0]*2][column + direction[1]*2] === player
        && board[row + direction[0]*3][column + direction[1]*3] === player) {
        value += THREEIN;
      }
      else if (board[row][column] === WHITE
        && board[row + direction[0]][column + direction[1]] === player
        && board[row + direction[0]*2][column + direction[1]*2] === WHITE
        && board[row + direction[0]*3][column + direction[1]*3] === player) {
        value += TWOIN;
      }

      return value;
    }

    /**
     * Helper function to retrieve the other player.
     * @param player
     * @returns opposite player.
     */
    this.otherPlayer = function(player) {
      if(player === RED)
        return YELLOW;

      return RED;
    }

    this.dropPiece = function(board, index, player) {
      var row = -1;
      var newBoard = board;
      for(var i = 0; i < ROWS; i++) {
        if(newBoard[i][index] === WHITE) {
          row = i;
        }
        if(row === -1) {
          return -1;
        }

        newBoard[row][index] = player;

        return [newBoard, row];

      }
    }

  });
