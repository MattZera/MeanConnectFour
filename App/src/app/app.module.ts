import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SocketService } from "./services/socket.service";
import { MenuComponent } from './menu/menu.component';
import { routing } from "./app.routing";
import { GameComponent } from './game/game.component';
import { BoardComponent } from "./game/board.component";
import {ConfirmLeaveGuard} from "./game/confirm-leave-guard";

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    MenuComponent,
    GameComponent
  ],
  entryComponents: [],
  imports: [
    routing,
    BrowserModule
  ],
  providers: [SocketService, ConfirmLeaveGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
