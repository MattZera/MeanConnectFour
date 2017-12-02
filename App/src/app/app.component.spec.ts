import { TestBed, async } from '@angular/core/testing';
import { AppComponent, MoveButton } from './app.component';
import { SocketService } from "./services/socket.service";
import { BoardComponent } from './board.component';
import { BoardRowComponent } from './boardRow.component';
import { BoardCellComponent } from './boardCell.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

describe('AppComponent', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        MoveButton,
        BoardComponent,
        BoardRowComponent,
        BoardCellComponent
      ],
      providers: [SocketService],
    }).overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [
          BoardRowComponent,
          BoardCellComponent
        ]
      }
    });
  });

  it('should create the app', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Connect Four'`, async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Connect Four');
  });

  it('should render title in a h1 tag', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to Connect Four!');
  });
});
