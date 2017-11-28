import {
  Component, ComponentFactory, ComponentRef,
  ComponentFactoryResolver, ViewContainerRef,
  ViewChild, OnInit, OnDestroy
} from '@angular/core';

import { BoardRowComponent } from './boardRow.component';

@Component({
  selector: 'board',
  template: '<table class="board"><tbody><ng-template #rowContainer></ng-template></tbody></table>',
  styleUrls: ['./board.component.css']
})

export class BoardComponent implements OnInit, OnDestroy {
  @ViewChild("rowContainer", { read: ViewContainerRef }) container;
  componentRef: ComponentRef<BoardRowComponent>[] = [];

  constructor(private resolver: ComponentFactoryResolver) { }

  ngOnInit() {
    this.container.clear();
    const factory: ComponentFactory<BoardRowComponent> = this.resolver.resolveComponentFactory(BoardRowComponent);
    for (let row = 0; row < 6; row++) {
      this.componentRef[row] = this.container.createComponent(factory);
    }
  }

  ngOnDestroy() {
    this.componentRef.forEach((comp: ComponentRef<BoardRowComponent>) => {
      comp.destroy();
    });
  }
}
