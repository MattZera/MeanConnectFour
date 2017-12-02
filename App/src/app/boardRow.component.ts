import {
  Component, ComponentFactory, ComponentRef,
  ComponentFactoryResolver, ViewContainerRef,
  ViewChild, OnInit, OnDestroy
} from '@angular/core';

import { BoardCellComponent } from './boardCell.component';

@Component({
  selector: 'tr',
  template: '<ng-template #cellContainer></ng-template>',
  styleUrls: ['./board.component.css']
})

export class BoardRowComponent implements OnInit, OnDestroy {
  @ViewChild("cellContainer", { read: ViewContainerRef }) container;
  componentRef: ComponentRef<BoardCellComponent>[] = [];

  constructor(private resolver: ComponentFactoryResolver) { }

  ngOnInit() {
    this.container.clear();
    const factory: ComponentFactory<BoardCellComponent> = this.resolver.resolveComponentFactory(BoardCellComponent);
    for (let col = 0; col < 7; col++) {
      this.componentRef[col] = this.container.createComponent(factory);
    }
  }

  ngOnDestroy() {
    this.componentRef.forEach((comp: ComponentRef<BoardCellComponent>) => {
      comp.destroy();
    });
  }
}
