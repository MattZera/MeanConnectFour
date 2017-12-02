import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent, MoveButton } from './app.component';
import { BoardComponent } from './board.component';
import { BoardRowComponent } from './boardRow.component';
import { BoardCellComponent } from './boardCell.component';
import { SocketService } from "./services/socket.service";


@NgModule({
  declarations: [
    AppComponent,
    MoveButton,
    BoardComponent,
    BoardCellComponent,
    BoardRowComponent
  ],
  entryComponents: [
    BoardComponent,
    BoardCellComponent,
    BoardRowComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [SocketService],
  bootstrap: [AppComponent]
})

export class AppModule { }
