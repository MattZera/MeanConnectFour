/**
 * Created by Zera on 12/1/17.
 */

const socketio = require('socket.io');

module.exports = function (server) {
  let io = socketio(server);

  io.on('connection', (client) => {
    console.log("connected");
    client.on('click', (data) => {
      console.log('clicked', data);
    });
  });

  return io;
};
