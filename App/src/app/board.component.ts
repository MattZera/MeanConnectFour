import { Component, Input } from '@angular/core';

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})

export class BoardComponent {
  @Input() board: number[][];
  @Input() animate: boolean;
  @Input() row: number;
  @Input() col: number;

  width = 100;

  onResize() {
    this.width = document.getElementsByClassName("row").item(0).clientHeight;
  }
}
