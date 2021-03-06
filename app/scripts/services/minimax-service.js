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
    const WIN = 1000000;
    var numIterations = 0;


    /**
     * Recursive function to find the best possible move
     * @param board
     * @param player
     * @param depth
     * @returns if depth > 0, returns minimax value for current state.  Otherwise, returns
     * best column choice.
     */
    this.minimax = function(board, player, depth, maxDepth) {
      var minimax = 0;
      var bestColumn = 0;
      numIterations++;

      //Call evaluation function on leaf nodes
      if(depth === maxDepth) {
        if(depth%2 === 0) {
          if(this.checkBoardForWin(board,this.otherPlayer(player)))
            minimax = -1*WIN;
          else if(this.checkBoardForDraw(board))
            minimax = 0;
          else {
            minimax = -1*this.evaluate(board, this.otherPlayer(player));
          }


        }
        else {
          if(this.checkBoardForWin(board,this.otherPlayer(player)))
            minimax = WIN;
          else if(this.checkBoardForDraw(board))
            minimax = 0;
          else {
            minimax = this.evaluate(board, this.otherPlayer(player));
          }

        }


        return minimax;
      }
      

      //no need for further evaluation if current state is in intermediate levels and results in a win or tie.
      if(depth%2 === 0) {
        if(this.checkBoardForWin(board, this.otherPlayer(player))) {
          return -1*WIN;
        }
        else if(this.checkBoardForDraw(board))
          return 0;
      }
      else {
        if(this.checkBoardForWin(board,this.otherPlayer(player))){
          return WIN;
        }
        else if(this.checkBoardForDraw(board))
          return 0;
      }

      var newBoard = [];
      var childValue = 0;

      //initialize minimax value based on whether current level is for maximizing or minimizing player
      if(depth%2 === 0)
        minimax = -10000000;
      else
        minimax = 10000000;
      //Determine the value of current state's children
      for(var i = 0; i < COLUMNS; i++) {

        if(this.canMove(board,i) === false) {
          if(i === bestColumn && depth === 0)
            while(this.canMove(board,bestColumn) === false)
              bestColumn = bestColumn+(1%(COLUMNS-1));
          continue;
        }


        newBoard = this.dropPiece(this.copyBoard(board), i, player);


        //find minimax value of ith child state
        childValue = this.minimax(newBoard, this.otherPlayer(player), depth+1, maxDepth);


        if(depth %2 === 0) {
          if(childValue >= minimax) {
            minimax = childValue;
            bestColumn = i;
          }
        }
        else {
          if(childValue <= minimax) {
            minimax = childValue;
            bestColumn = i;
          }
        }

      }


      if(depth === 0) {
        console.log(numIterations);
        return bestColumn;
      }

      return minimax;



    }

    /**
     * Alpha-Beta variation of minimax function.
     * @param board
     * @param player
     * @param depth
     * @param alpha
     * @param beta
     * @returns {number}
     */

    this.alphabeta = function(board, player,depth,maxDepth, alpha, beta) {
      var minimax = 0;
      var bestColumn = 0;
      numIterations++;


      console.log(depth);
      //Call evaluation function on leaf nodes
      if(depth === maxDepth) {
        //console.log(board);
        if(depth%2 === 0) {
          if(this.checkBoardForWin(board,this.otherPlayer(player)))
            minimax = -1*WIN;
          else if(this.checkBoardForDraw(board))
            minimax = 0;
          else {
            minimax = -1*this.evaluate(board, this.otherPlayer(player));
          }


        }
        else {
          if(this.checkBoardForWin(board,this.otherPlayer(player)))
            minimax = WIN;
          else if(this.checkBoardForDraw(board))
            minimax = 0;
          else {
            minimax = this.evaluate(board, this.otherPlayer(player));
          }

        }


        return minimax;
      }



      //no need for further evaluation if current state is in intermediate levels and results in a win or tie.
      if(depth%2 === 0) {
        if(this.checkBoardForWin(board, this.otherPlayer(player))) {
          return -1*WIN;
        }
        else if(this.checkBoardForDraw(board))
          return 0;
      }
      else {
        if(this.checkBoardForWin(board,this.otherPlayer(player))){
          return WIN
        }
        else if(this.checkBoardForDraw(board))
          return 0;
      }

      var newBoard = [];
      var childValue = 0;
      var a = alpha;
      var b = beta;
      //initialize minimax value based on whether current level is for maximizing or minimizing player
      if(depth%2 === 0)
        minimax = -10000000;
      else
        minimax = 10000000;

      //Determine the value of current state's children
      for(var i = 0; i < COLUMNS; i++) {

        if(this.canMove(board,i) === false) {
          if(i===bestColumn)
            while(this.canMove(board,bestColumn) === false)
              bestColumn = bestColumn+1%(COLUMNS-1);
          continue;
        }


        newBoard = this.dropPiece(this.copyBoard(board), i, player);



        //find minimax value of ith child state
        childValue = this.alphabeta(newBoard, this.otherPlayer(player), depth+1,maxDepth, a, b);


        if(depth %2 === 0) {
          if(childValue > minimax) {
            minimax = childValue;
            bestColumn = i;
            if(minimax > a){
              a = minimax;
            }

            if(a > b)
              break;
          }
        }
        else {
          if(childValue < minimax) {
            minimax = childValue;
            bestColumn = i;
            if(minimax < b) {
              b = minimax;
            }
            if(a > b)
              break;
          }
        }

        childValue = 0;

      }


      if(depth === 0) {
        return bestColumn;
      }

      return minimax;
    }

    /**
     * Evaluates the given game state.
     * @param board
     * @param row
     * @param column
     * @param player
     * @returns {number}
     */
    this.evaluate = function (board, player) {
      var value = 0;

      for(var row = 0; row < ROWS; row++) {
        for (var column = 0; column < COLUMNS; column++) {

          //Vertical 3 in a row
          if (row > 2
            && board[row][column] === player
            && board[row - 1][column] === player
            && board[row - 2][column] === player
            && board[row - 3][column] === WHITE) {
            value += THREEIN;
          }

          //Vertical 2 in a row
          else if (row > 2
            && board[row][column] === player
            && board[row - 1][column] === player
            && board[row - 2][column] === WHITE
            && board[row - 3][column] === WHITE) {
            value += TWOIN;
          }


          //evaluate horizontal
            if (column < COLUMNS - 3) {
              value += 3*this.checkForTwo(board, row, column, player, DIRECTIONS[2]);
              value += 3*this.checkForThree(board, row, column, player, DIRECTIONS[2]);
            }


          //evaluate NE
            if (column < COLUMNS - 3 && row > 2) {
              value += 2*this.checkForTwo(board, row, column, player, DIRECTIONS[1]);
              value += 2*this.checkForThree(board, row, column, player, DIRECTIONS[1]);
            }


          //evaluate NW

            if (column > 2 && row > 2) {
              value += 2*this.checkForTwo(board, row, column, player, DIRECTIONS[3]);
              value += 2*this.checkForThree(board, row, column, player, DIRECTIONS[3]);
            }
        }
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
      else if (row + direction[0]*4 < ROWS
        &&row + direction[0]*4 >= 0
        && column + direction[1]*4 < COLUMNS
        && column + direction[1]*4 >=0
        && board[row][column] === WHITE
        && board[row + direction[0]][column + direction[1]] === player
        && board[row + direction[0]*2][column + direction[1]*2] === player
        && board[row + direction[0]*3][column + direction[1]*3] === player
        && board[row + direction[0]*4][column + direction[1]*4] === WHITE) {
        value += THREEIN*2;
      }

      return value;
    }

    /**
     * Helper function to check for win in a particular direction.
     * @param board
     * @param row
     * @param column
     * @param player
     * @param direction
     * @returns {number}
     */

    this.checkForWin = function(board, row, column, player, direction) {
      var value = 0;
      if (board[row][column] === player
        && board[row + direction[0]][column + direction[1]] === player
        && board[row + direction[0]*2][column + direction[1]*2] === player
        && board[row + direction[0]*3][column + direction[1]*3] === player) {
        value+=WIN;
      }

      return value;
    }

    /**
     * Checks entire board for win.
     * @param board
     * @param player
     * @returns {boolean}
     */
    this.checkBoardForWin = function(board,player) {
      for (var row = 0; row < ROWS; row++) {
        for (var column = 0; column < COLUMNS; column++) {

          if (row > 2
            && board[row][column] === player
            && board[row - 1][column] === player
            && board[row - 2][column] === player
            && board[row - 3][column] === player) {
            return true;
          }


          //evaluate horizontal
          //1100
          if (column < COLUMNS - 3) {
            if (this.checkForWin(board, row, column, player, DIRECTIONS[2]) >= WIN)
              return true;
          }


          //evaluate NE
          if (column < COLUMNS - 3 && row > 2) {
            if (this.checkForWin(board, row, column, player, DIRECTIONS[1]) >= WIN)
              return true;
          }


          //evaluate NW

          if (column > 2 && row > 2) {
            if (this.checkForWin(board, row, column, player, DIRECTIONS[3]) >= WIN)
              return true;
          }
        }
      }
      return false;
    }

    /**
     * Checks entire board for draw.
     * @param board
     * @returns {boolean}
     */

    this.checkBoardForDraw = function (board) {
      for(var i = 0; i < COLUMNS; i++) {
        if(board[0][i] === WHITE){
          return false;
        }

      }

      return true;

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
      for(var i = ROWS - 1; i >= 0; i--) {
        if(board[i][index] === WHITE) {
          row = i;
          break;
        }
      }
      if(row === -1) {
        return -1;
      }

      newBoard[row][index] = player;

      return newBoard;
    }


    /**
     * Makes a duplicate copy of the game board. Generally used to avoid
     * reference issues with the board being copied.
     * @param board
     * @returns {*}
     */

    this.copyBoard = function( board ) {

      var i, copy;

      if( Array.isArray( board ) ) {
        copy = board.slice( 0 );
        for( i = 0; i < copy.length; i++ ) {
          copy[ i ] = this.copyBoard( copy[ i ] );
        }
        return copy;
      } else if( typeof arr === 'object' ) {
        throw 'Cannot clone array containing an object!';
      } else {
      }
      return board;

    }

    /**
     * Creates a string version of the game board.
     * @param b
     * @returns {string}
     */

    this.printBoard = function(b) {
      var board = '| ';
      for(var i = 0; i < ROWS; i++) {
        for(var j = 0; j < COLUMNS; j++) {
          board += b[i][j] + ' | ';
        }
        board += '\n| ';
      }
      return board;
    }

    /**
     * Determines if column is full.
     * @param board
     * @param column
     * @returns {boolean}
     */

    this.canMove = function(board, column) {
      if(board[0][column] === WHITE)
        return true;
      return false;
    }
  });
