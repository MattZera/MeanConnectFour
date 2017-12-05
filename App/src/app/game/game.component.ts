import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SocketService} from "../services/socket.service";


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

export class GameComponent implements OnInit, OnDestroy {


  player = 1;
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
  animate: boolean;
  row = -1;
  col = -1;
  endGame = false;


  constructor(private route: ActivatedRoute,
              private router: Router,
              private socket: SocketService) { }


  ngOnInit() {
    this.socket.getMessagesFor("connect").subscribe(() => {
      console.log("connected")
    });

    this.socket.receive('gamestate', (data) => {
      console.log('response', data);

      this.board = this.transpose(data.board);
      this.player = data.player;
      this.animate = data.lastMove !== null;
      if (data.lastMove !== null){
        this.row = data.lastMove.row;
        this.col = data.lastMove.col;
      }

      if (data.winner !== null){
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
