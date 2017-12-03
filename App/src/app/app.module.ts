import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent, MoveButton } from './app.component';
import { BoardComponent } from './board.component';
import { SocketService } from "./services/socket.service";


@NgModule({
  declarations: [
    AppComponent,
    MoveButton,
    BoardComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule
  ],
  providers: [SocketService],
  bootstrap: [AppComponent]
})

export class AppModule { }
