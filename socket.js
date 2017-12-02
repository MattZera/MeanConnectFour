/**
 * Created by Zera on 12/1/17.
 */

const socketio = require('socket.io');
const checkWin = require('./bin/gameLogic').checkWin;
const isTie = require('./bin/gameLogic').isTie;

let board = [];
let player = 1;

function setup(client) {
  board = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]
  ];

  player = 1;

  client.emit('setup', {
    player: player,
    board: board
  });
}

module.exports = function (server) {
  let io = socketio(server);

  io.on('connection', (client) => {
    console.log("connected");

    setup(client);

    client.on('click', (data) => {
      console.log('clicked', data);
      console.log(board);
      const win = checkWin(board, data, player);

      console.log(win);
      console.log(board);
      if (win || isTie(board)) {
        setup(client);
      } else {
        player = 2 - player + 1;

        client.emit('response', {
          player: player,
          win: win,
          board: board
        });
      }
    });
  });

  return io;
};
