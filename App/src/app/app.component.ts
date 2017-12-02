import { Component, OnInit, Input } from '@angular/core';
import { SocketService } from "./services/socket.service";
import { Observable } from "rxjs/Observable";

@Component({
  selector: 'move-button',
  template: '<div class="coin player{{player}} {{active(column)}}" (click)="callback(column)"></div>',
  styleUrls: ['./app.component.css']
})

export class MoveButton {
  @Input() callback: Function;
  @Input() column: number;
  @Input() player: number;
  @Input() active = () => {};
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'Connect Four';
  player = 1;
  board = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]
  ];

  constructor(private socket: SocketService) { }

  ngOnInit() {
    this.socket.messages("connect").subscribe(() => {
      console.log("connected")
    });

    this.socket.receive('setup', (data) => {
      console.log('setup', data);
      this.board = data.board;
      this.player = data.player;
    });

    this.socket.receive('response', (data) => {
      console.log('response', data);
      this.board = data.board;
      this.player = data.player;
    });
  }

  handleClick(data) {
    this.socket.send("click", data);
  }

  isActive(column) {
    if (this.board[0][column] !== 0) {
      return "inactive";
    } else {
      return "active";
    }
  }
}
