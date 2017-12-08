import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
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
  board: Array<Array<number>> = [
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
  message = "";
  waiting = false;
  votes = Array<number>(7).fill(0);
  voted = false;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private socket: SocketService) { }

  ngOnInit() {

    this.gameState = this.socket.getMessagesFor('gamestate').subscribe((data) => {
      console.log('response', data);
      this.board = this.transpose(data.board);

      if (data.waiting) {
        this.waiting = true;
        this.message = "...waiting for player " + (2 - this.player + 1);
      } else {
        this.waiting = false;
      }

      if (data.lastMove === null) {
        if (this.socket.getId() === data.players[0] || data.gameType === 'democratic') {
          this.player = data.playerOne;
        } else {
          this.player = data.playerTwo;
        }

        if (data.gameType === 'democratic' && data.players.length == 1) {
          this.nextPlayer = 0;
          this.message = "...waiting for players";
        } else if (data.gameType === 'multiplayer' && data.players.length == 1) {
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
      } else {
        if (data.updateVotes) {
          this.votes = data.votes;
          this.animate = false;
        } else {
          this.animate = true;
          this.voted = false;
          this.nextPlayer = data.nextPlayer;
          this.row = data.lastMove.row;
          this.col = data.lastMove.col;
        }
      }

      if (data.winner !== null) {
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
      this.waiting = true;
      this.voted = true;
      this.nextPlayer = 2 - this.player + 1;
      this.socket.send("makemove", data);
    }
  }

  isActive(column) {
    if (this.board[column][0] !== 0) {
      return "inactive";
    } else {
      return "active";
    }
  }

  hasVoted() {
    if (this.voted) {
      return "voted";
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
    this.message = "";
    this.socket.send('newgame', this.gameType);
  }
}
