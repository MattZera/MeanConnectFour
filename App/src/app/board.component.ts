import {
  Component, ComponentFactory, ComponentRef,
  ComponentFactoryResolver, ViewContainerRef,
  ViewChild, OnInit, OnDestroy, OnChanges,
  ReflectiveInjector, Input
} from '@angular/core';

//import { BoardRowComponent } from './boardRow.component';

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})

export class BoardComponent  {
  @Input() board: number[][];
}
