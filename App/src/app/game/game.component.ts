import { Component, OnDestroy, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import { SocketService } from "../services/socket.service";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

export class GameComponent implements OnInit, OnDestroy {
  gameType: string;
  gameState: Subscription;
  player = 0;
  nextPlayer = 1;
  columns = [0, 1, 2, 3, 4, 5, 6];
  board = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0]
  ];
  animate = false;
  row = -1;
  col = -1;
  winner: number = null;
  message = "...waiting for player 1";
  waiting = false;
  votes = [0, 0, 0, 0, 0, 0, 0];
  voted = false;

  constructor(private route: ActivatedRoute,
    private socket: SocketService) { }

  ngOnInit() {

    this.gameState = this.socket.getMessagesFor('gamestate').subscribe((data) => {
      console.log('response', data);
      this.board = this.transpose(data.board);

      if (data.waiting) {
        this.waiting = true;
        this.message = "...waiting for player " + (2 - this.player + 1);
        if (this.gameType === 'democratic') {
          this.socket.send('clearVote');
        }
      } else {
        this.waiting = false;
      }

      if (!data.winner) {
        if (this.socket.getId() === data.players[0] || this.gameType === 'democratic') {
          this.player = data.playerOne;
        } else {
          this.player = data.playerTwo;
        }
      }

      if (!data.lastMove && !data.winner) {
        if (this.gameType === 'democratic' && data.players.length == 1) {
          this.waiting = true;
          this.nextPlayer = 0;
          this.message = "...waiting for players";
        } else if (this.gameType === 'multiplayer' && data.players.length == 1) {
          this.nextPlayer = 0;
          this.message = "...waiting for player";
        } else if (this.player == 2) {
          this.waiting = true;
          this.nextPlayer = 1;
          this.message = "...waiting for player 1";
        } else {
          this.nextPlayer = 1;
          this.message = "...waiting for player " + (2 - this.player + 1);
        }

        if (data.updateVotes) {
          this.votes = data.votes;
          this.animate = false;
        }
      } else {
        if (this.gameType === 'democratic') {
          this.votes = data.votes;
        }

        if (data.updateVotes) {
          this.animate = false;
          this.row = -1;
          this.col = -1;
        } else if (data.lastMove) {
          this.voted = false;
          this.nextPlayer = data.nextPlayer;

          if (data.lastMove.row == this.row && data.lastMove.col == this.col) {
            this.animate = false;
            this.row = -1;
            this.col = -1;
          } else {
            this.animate = true;
            this.row = data.lastMove.row;
            this.col = data.lastMove.col;
          }
        }
      }

      if (data.winner) {
        this.winner = data.winner;
        if (data.winner == this.player) {
          this.message = "You Win!";
        } else if (data.winner == 3) {
          this.message = "You Tie!";
        } else {
          this.message = "You Lose!";
        }
      }
    });

    this.route.params.map(p => p.gametype).subscribe((gametype) => {
      this.gameType = gametype;
      this.newGame();
    });
  }

  ngOnDestroy(): void {
    this.gameState.unsubscribe();
  }

  handleClick(data) {
    if (!this.voted) {
      if (this.gameType === 'democratic') {
        this.voted = true;
      } else {
        this.waiting = true;
        this.nextPlayer = 2 - this.player + 1;
      }
      this.socket.send("makemove", data);
    }
  }

  transpose(board) {
    return board[0].map(function (col, c) {
      return board.map(function (row, r) {
        return board[r][c];
      });
    });
  }

  newGame() {
    this.player = 0;
    this.nextPlayer = 1;
    this.row = -1;
    this.col = -1;
    this.winner = null;
    this.waiting = false;
    this.animate = false;
    this.board = [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0]
    ];
    this.votes = [0, 0, 0, 0, 0, 0, 0];
    this.voted = false;
    this.message = "...waiting for player 1";
    this.socket.send('newgame', this.gameType);
  }

}
