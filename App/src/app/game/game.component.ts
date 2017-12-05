import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SocketService} from "../services/socket.service";

@Component({
  selector: 'move-button',
  template: '<div class="coin player{{player}} {{active(column)}}" (click)="callback(column)"></div>',
  styleUrls: ['./game.component.scss']
})

export class MoveButton {
  @Input() callback: Function;
  @Input() column: number;
  @Input() player: number;
  @Input() active = () => { };
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

export class GameComponent implements OnInit, OnDestroy {


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
  animate: boolean;
  row = -1;
  col = -1;
  endGame = false;


  constructor(private route: ActivatedRoute,
              private router: Router,
              private socket: SocketService) { }


  ngOnInit() {
    this.socket.messages("connect").subscribe(() => {
      console.log("connected")
    });

    this.socket.receive('setup', (data) => {
      this.board = this.transpose(data.board);
      this.player = data.player;
      this.nextPlayer = 1 ;
      this.animate = false;
      this.row = -1;
      this.col = -1;
      this.endGame = false;
    });

    this.socket.receive('response', (data) => {
      console.log('response', data);
      this.board = this.transpose(data.board);
      this.nextPlayer = data.nextPlayer;
      this.animate = true;
      this.row = data.moveData.row;
      this.col = data.moveData.col;

      if (data.win === "win"){
        this.endGame = true;
        // do something on win
        // data.winningPlayer available
      } else if (data.win === "tie") {
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
