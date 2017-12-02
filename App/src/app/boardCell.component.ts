import { Component } from '@angular/core';

@Component({
  selector: 'td',
  template: '<div class="board-hole player{{player}}"></div>',
  styleUrls: ['./board.component.css']
})

export class BoardCellComponent {
  player = 0;
}
