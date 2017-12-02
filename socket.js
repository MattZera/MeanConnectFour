/**
 * Created by Zera on 12/1/17.
 */

const socketio = require('socket.io');

module.exports = function(server){
    let io = socketio(server);

    io.on('connection', function(client){
        console.log("connected");
    });

    return io;
};
