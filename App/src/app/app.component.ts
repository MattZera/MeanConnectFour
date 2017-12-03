import {Component, OnInit} from '@angular/core';
import {SocketService} from "./services/socket.service";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  constructor(private socket: SocketService) { }

  ngOnInit() {
    this.socket.messages("connect").subscribe(()=>console.log("connected"));
  }
}
