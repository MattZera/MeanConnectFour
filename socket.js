/**
 * Created by Zera on 12/1/17.
 */

const socketio = require('socket.io');
const checkWin = require('./bin/gameLogic').checkWin;
const isTie = require('./bin/gameLogic').isTie;

function setup(client, board, player) {
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
    let board = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0]
    ];
    let player = 1;

    setup(client, board, player);

    client.on('click', (data) => {
      const moveData = checkWin(board, data, player);

      data = {
        win: "no",
        board: board,
        nextPlayer: 2 - player + 1,
        moveData: {
          row: moveData.row,
          col: moveData.col
        }
      };

      if (moveData.win) {
        data.win = "win";
        data.winningPlayer = player;
      } else if (isTie(board)) {
        data.win = "tie";
      }

      player = data.nextPlayer;
      client.emit('response', data);
    });
  });

  return io;
};
