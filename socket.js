/**
 * Created by Zera on 12/1/17.
 */

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

        this.winner = null;
        this.lastMove = null;
    }

    set currentPlayer(player) {
        this._currentPlayer = (player-1)%2 + 1;
    }
    get currentPlayer() {
        if (!this._currentPlayer) this.currentPlayer = Math.floor(Math.random() * 2 + 1);
        return this._currentPlayer;
    }

    move(column) {
        if (this.winner) return;

        if (column === undefined) column = ai(this.board, this.currentPlayer);

        const moveData = checkWin(this.board, column, this.currentPlayer);

        this.lastMove = {col: moveData.col, row: moveData.row};

        if (moveData.win) {
            this.winner = this.currentPlayer;
        } else if (isTie(this.board)) {
            this.winner = 3;
        }

        this.currentPlayer++;
    }

    get gamestate() {
        return {
            board: this.board,
            player: this.currentPlayer,
            winner: this.winner,
            lastMove: this.lastMove
        };
    }

}


module.exports = function (server) {
    let io = socketio(server);

    io.on('connection', (client) => {

        console.log("connected");


        let game = new Game();

        if (game.currentPlayer === 2){
            game.move();
        }

        client.emit('gamestate', game.gamestate);

        client.on('click', (data) => {
            game.move(data);
            client.emit('gamestate', game.gamestate);

            if (game.currentPlayer === 2 && game.winner === null) {
                game.move();
            }
            client.emit('gamestate', game.gamestate);
        });

    });

    return io;
};
