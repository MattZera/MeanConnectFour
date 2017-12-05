import { TestBed, async } from '@angular/core/testing';
import { AppComponent} from './app.component';
import { SocketService } from "./services/socket.service";
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import {BoardComponent} from "./game/board.component";
import {MoveButton} from "./game/game.component";

describe('AppComponent', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        MoveButton,
        BoardComponent
      ],
      providers: [SocketService],
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
