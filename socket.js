/**
 * Created by Zera on 12/1/17.
 */

"use strict";

const socketio = require('socket.io');
const checkWin = require('./bin/gameLogic').checkWin;
const isTie = require('./bin/gameLogic').isTie;
const ai = require('./bin/aiLogic').callAI;

class Game {
  constructor() {
    this.board = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0]
    ];

    this._players = [];
    this.winner = null;
    this.lastMove = null;
    this.currentPlayer = 1;
    this.playerOne = Math.floor(Math.random() * 2 + 1);
    this.playerTwo = 2 - this.playerOne + 1
    this.gameType = 'singleplayer';
    this._votes = Array(7).fill(0);
  }

  set currentPlayer(player) {
    this._currentPlayer = (player - 1) % 2 + 1;
  }

  get currentPlayer() {
    return this._currentPlayer;
  }

  vote(column) {
    this._votes[column]++;
  }

  undoVote(column) {
    this._votes[column]--;
  }

  get totalVotes() {
    function getSum(total, value) {
      return total + value;
    }

    return this._votes.reduce(getSum);
  }

  get maxVote() {
    let max = 0;
    let column = [];

    for (let i = 0; i < 7; i++) {
      const value = this._votes[i];
      if (value > max) {
        max = value;
        column = [i];
      } else if (value == max) {
        column.push(i);
      }
    }

    const index = Math.floor(Math.random() * column.length);
    return column[index];
  }

  clearVotes() {
    this._votes = Array(7).fill(0);
  }

  move(column) {
    if (this.winner) return;

    if (column === undefined) column = ai(this.board, this.currentPlayer);

    const moveData = checkWin(this.board, column, this.currentPlayer);

    this.lastMove = {
      col: moveData.col,
      row: moveData.row
    };

    if (moveData.win) {
      this.winner = this.currentPlayer;
    } else if (isTie(this.board)) {
      this.winner = 3;
    }

    this.currentPlayer++;
  }

  join(player) {
    this._players.push(player);
  }

  get players() {
    return this._players;
  }

  get gamestate() {
    let data = {
      board: this.board,
      nextPlayer: this.currentPlayer,
      winner: this.winner,
      lastMove: this.lastMove,
      players: this.players,
      playerOne: this.playerOne,
      playerTwo: this.playerTwo
    };

    if (this.gameType === 'democratic') {
      data.votes = this._votes;
    }

    return data;
  }
}

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16 | 0,
      v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

module.exports = function (server) {
  let io = socketio(server);
  let multiPlayerGames = [];
  let democratic = null;

  io.on('connection', (client) => {
    console.log("connected");

    let game;
    let previousMove;

    client.on('newgame', (type) => {
      previousMove = null;

      switch (type) {
        case 'singleplayer':
          game = new Game();
          game.join(client.id);
          client.emit('gamestate', game.gamestate);

          if (game.playerOne !== 1) {
            game.move();
            client.emit('gamestate', game.gamestate);
          }
          break;

        case 'multiplayer':
          if (multiPlayerGames.length > 0) {
            game = multiPlayerGames.shift();
            game.join(client.id);
            game.gameType = type;
            client.emit('gamestate', game.gamestate);
            client.broadcast.to(game.players[0]).emit('gamestate', game.gamestate);
          } else {
            game = new Game();
            game.join(client.id);
            game.gameType = type;
            multiPlayerGames.push(game);
            client.emit('gamestate', Object.assign({
              waiting: true
            }, game.gamestate));
          }

          console.log(multiPlayerGames.length + " Multiplayer");
          break;

        case 'democratic':
          client.join('democratic');

          if (democratic) {
            game = democratic;
            game.join(client.id);
            game.gameType = type;
            client.emit('gamestate', game.gamestate);
            
            if (game.players.length === 2) {
              client.broadcast.to('democratic').emit('gamestate', game.gamestate);

              if (game.playerOne !== 1) {
                game.move();
                io.to('democratic').emit('gamestate', game.gamestate);
              }
            }
          } else {
            game = new Game();
            game.join(client.id);
            game.gameType = type;
            democratic = game;
            client.emit('gamestate', Object.assign({
              waiting: true
            }, game.gamestate));
          }

          console.log(game.players.length + " players in democratic");
          break;

        default:
          break;
      }
    });

    client.on('makemove', (data) => {
      previousMove = data;

      switch (game.gameType) {
        case 'singleplayer':
          game.move(data);
          client.emit('gamestate', Object.assign({
            waiting: true
          }, game.gamestate));

          if (game.currentPlayer !== game.playerOne && game.winner === null) {
            game.move();
            client.emit('gamestate', game.gamestate);
          }
          break;

        case 'multiplayer':
          game.move(data);
          client.emit('gamestate', Object.assign({
            waiting: true
          }, game.gamestate));

          if (client.id === game.players[0]) {
            client.broadcast.to(game.players[1]).emit('gamestate', game.gamestate);
          } else {
            client.broadcast.to(game.players[0]).emit('gamestate', game.gamestate);
          }
          break;

        case 'democratic':
          game.vote(data);

          if (game.totalVotes < game.players.length) {
            io.to('democratic').emit('gamestate', Object.assign({
              updateVotes: true
            }, game.gamestate));
          } else {
            game.move(game.maxVote);
            game.clearVotes();
            io.to('democratic').emit('gamestate', Object.assign({
              waiting: true
            }, game.gamestate));

            if (game.currentPlayer !== game.playerOne && game.winner === null) {
              game.move();
              io.to('democratic').emit('gamestate', game.gamestate);
            }

            if (game.winner) {
              democratic = null;
            }
          }
          break;

        default:
          break;
      }
    });
  });

  return io;
};
