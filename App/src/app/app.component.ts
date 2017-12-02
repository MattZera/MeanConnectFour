import { Component, OnInit, Input } from '@angular/core';
import { SocketService } from "./services/socket.service";
import { Observable } from "rxjs/Observable";

@Component({
  selector: 'move-button',
  template: '<div class="coin" (click)="callback(column)"></div>',
  styleUrls: ['./app.component.css']
})

export class MoveButton {
  @Input() callback: Function;
  @Input() column: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'Connect Four';

  constructor(private socket: SocketService) { }

  ngOnInit() {
    this.socket.messages("connect").subscribe(() => {
      console.log("connected")
    });
  }

  handleClick(data) {
    this.socket.send("click", data);
  }
}
