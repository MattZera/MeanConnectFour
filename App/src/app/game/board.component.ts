import { Component, Input } from '@angular/core';

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})

export class BoardComponent {
  @Input() board: number[][];
  @Input() animate: boolean;
  @Input() animateRow: number;
  @Input() animateCol: number;

  width: number = this.onResize();

  onResize() {
    const windowWidth = window.innerWidth;
    this.width = 100;

    if (windowWidth <= 370) {
      this.width = 40;
    } else if (windowWidth > 370 && windowWidth <= 715) {
      this.width = 50;
    }

    return this.width;
  }
}
