/**
 * Created by Zera on 12/1/17.
 */

const socketio = require('socket.io');
const checkWin = require('./bin/gameLogic').checkWin;
const isTie = require('./bin/gameLogic').isTie;
const ai = require('./bin/aiLogic').callAI;

function setup(client, board) {
  board = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]
  ];

  player = Math.floor(Math.random() * 2 + 1);

  client.emit('setup', {
    player: player,
    board: board
  });

  return player;
}

function makeMove(client, board, move, player) {
  const moveData = checkWin(board, move, player);

  const data = {
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

  client.emit('response', data);
  return {
    player: data.nextPlayer,
    win: data.win
  };
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
    let aiPlayer = 2;

    player = setup(client, board);
    aiPlayer = 2 - player + 1;
    console.log(player, aiPlayer);

    if (player == 2) {
      const move = ai(board, aiPlayer);
      const info = makeMove(client, board, move, aiPlayer);
      player = info.player;
    }

    client.on('click', (data) => {
      const info = makeMove(client, board, data, player);
      player = info.player;

      if (player == aiPlayer && info.win === "no") {
        const move = ai(board, aiPlayer);
        const info = makeMove(client, board, move, aiPlayer);
        player = info.player;
      }
    });
  });

  return io;
};
