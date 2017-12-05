import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SocketService } from "./services/socket.service";
import { MenuComponent } from './menu/menu.component';
import {routing} from "./app.routing";
import {GameComponent, MoveButton} from './game/game.component';
import {BoardComponent} from "./game/board.component";

@NgModule({
  declarations: [
    AppComponent,
    MoveButton,
    BoardComponent,
    MenuComponent,
    GameComponent
  ],
  entryComponents: [],
  imports: [
    routing,
    BrowserModule
  ],
  providers: [SocketService],
  bootstrap: [AppComponent]
})

export class AppModule { }
