import {
  Component, ComponentFactory, ComponentRef,
  ComponentFactoryResolver, ViewContainerRef,
  ViewChild, OnInit, OnDestroy, OnChanges,
  ReflectiveInjector, Input, Injector
} from '@angular/core';

import { BoardCellComponent } from './boardCell.component';

@Component({
  selector: 'tr',
  template: '<ng-template #cellContainer></ng-template>',
  styleUrls: ['./board.component.css']
})

export class BoardRowComponent implements OnInit, OnDestroy, OnChanges {
  row: number[];

  @ViewChild("cellContainer", { read: ViewContainerRef }) container;
  componentRef: ComponentRef<BoardCellComponent>[] = [];

  constructor(private resolver: ComponentFactoryResolver, private injector: Injector) {
    this.row = this.injector.get('row');
  }

  ngOnInit() {
    this.container.clear();
    console.log('init row', this.row);

    // We create a factory out of the component we want to create
    const factory = this.resolver.resolveComponentFactory(BoardCellComponent);

    for (let col = 0; col < 7; col++) {
      // Inputs need to be in the following format to be resolved properly
      const inputProviders = { provide: "player", useValue: this.row[col] };
      const resolvedInputs = ReflectiveInjector.resolve([inputProviders]);

      // We create an injector out of the data we want to pass down and this components injector
      const injector = ReflectiveInjector.fromResolvedProviders(resolvedInputs, this.container.parentInjector);

      // We create the component using the factory and the injector
      this.componentRef[col] = factory.create(injector);
      this.container.insert(this.componentRef[col].hostView);
    }
  }

  ngOnChanges() {
    if (this.componentRef.length === 0) {
      return;
    }
    
    console.log('change row', this.row);
    for (let col = 0; col < 7; col++) {
      this.componentRef[col].instance.player = this.row[col];
    }
  }

  ngOnDestroy() {
    this.componentRef.forEach((comp: ComponentRef<BoardCellComponent>) => {
      comp.destroy();
    });
  }
}
