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
  nextPlayer: number = 1;
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

  constructor(private route: ActivatedRoute,
    private router: Router,
    private socket: SocketService) { }

  ngOnInit() {

    this.gameState = this.socket.getMessagesFor('gamestate').subscribe((data) => {
      console.log('response', data);
      this.board = this.transpose(data.board);

      if (data.players[0] == this.socket.getId()){
        this.player = 1;
      }else {
        this.player = 2;
      }

      if (data.lastMove !== null) {
        this.animate = true;
        this.nextPlayer = data.player;
        this.row = data.lastMove.row;
        this.col = data.lastMove.col;
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

    this.route.params.map(p => p.gametype).subscribe((gametype)=>{
      this.gameType = gametype;
      this.newGame();
    });

  }

  ngOnDestroy(): void {
    this.gameState.unsubscribe();
  }

  handleClick(data) {
    this.socket.send("makemove", data);
  }

  isActive(column) {
    if (this.board[column][0] !== 0) {
      return "inactive";
    } else {
      return "active";
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
    this.row = -1;
    this.col = -1;
    this.winner = null;
    this.socket.send('newgame', this.gameType);
  }
}
