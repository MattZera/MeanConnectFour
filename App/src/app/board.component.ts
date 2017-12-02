import {
  Component, ComponentFactory, ComponentRef,
  ComponentFactoryResolver, ViewContainerRef,
  ViewChild, OnInit, OnDestroy, OnChanges,
  ReflectiveInjector, Input
} from '@angular/core';

import { BoardRowComponent } from './boardRow.component';

@Component({
  selector: 'board',
  template: '<table class="board"><tbody><ng-template #rowContainer></ng-template></tbody></table>',
  styleUrls: ['./board.component.css']
})

export class BoardComponent implements OnInit, OnDestroy, OnChanges {
  @Input() board: number[][];

  @ViewChild("rowContainer", { read: ViewContainerRef }) container;
  componentRef: ComponentRef<BoardRowComponent>[] = [];

  constructor(private resolver: ComponentFactoryResolver) { }

  ngOnInit() {
    this.container.clear();
    console.log('setting board', this.board);

    // We create a factory out of the component we want to create
    const factory = this.resolver.resolveComponentFactory(BoardRowComponent);

    for (let row = 0; row < 6; row++) {
      // Inputs need to be in the following format to be resolved properly
      const inputProviders = { provide: "row", useValue: this.board[row] };
      const resolvedInputs = ReflectiveInjector.resolve([inputProviders]);

      // We create an injector out of the data we want to pass down and this components injector
      const injector = ReflectiveInjector.fromResolvedProviders(resolvedInputs, this.container.parentInjector);

      // We create the component using the factory and the injector
      this.componentRef[row] = factory.create(injector);
      this.container.insert(this.componentRef[row].hostView);
    }
  }

  ngOnChanges() {
    if (this.componentRef.length === 0) {
      return;
    }

    console.log('changing board', this.board);
    for (let row = 0; row < 6; row++) {
      this.componentRef[row].instance.row = this.board[row];
      this.componentRef[row].instance.ngOnChanges();
    }
  }

  ngOnDestroy() {
    this.componentRef.forEach((comp: ComponentRef<BoardRowComponent>) => {
      comp.destroy();
    });
  }
}
