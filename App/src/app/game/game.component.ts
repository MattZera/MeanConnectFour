import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SocketService} from "../services/socket.service";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

export class GameComponent implements OnInit, OnDestroy {

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
  animate: boolean;
  row = -1;
  col = -1;
  endGame = false;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private socket: SocketService) { }

  ngOnInit() {
    this.gameState = this.socket.getMessagesFor('gamestate').subscribe((data) => {

      console.log('response', data);

      this.board = this.transpose(data.board);

      if (data.lastMove !== null) {
        this.animate = true;
        this.nextPlayer = data.player;
        this.row = data.lastMove.row;
        this.col = data.lastMove.col;
      } else {
        this.player = data.player;
      }

      if (data.winner !== null) {
        this.endGame = true;
        // do something on win
        // data.winningPlayer available
      } else if (data.winner === 3) {
        this.endGame = true;
        // do something on tie
      }
    });
  }

  ngOnDestroy(): void {
    this.gameState.unsubscribe();
  }

  handleClick(data) {
    this.socket.send("click", data);
  }

  isActive(column) {
    if (this.board[column][0] !== 0 || this.endGame) {
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
}
