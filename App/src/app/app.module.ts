import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BoardComponent } from './board.component';
import { BoardRowComponent } from './boardRow.component';
import { BoardCellComponent } from './boardCell.component';

@NgModule({
  declarations: [
    AppComponent,
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
