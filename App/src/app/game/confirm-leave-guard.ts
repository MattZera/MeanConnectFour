import {CanDeactivate} from "@angular/router";
import {GameComponent} from "./game.component";
import {Injectable} from "@angular/core";


@Injectable()
export class ConfirmLeaveGuard implements CanDeactivate<GameComponent>{

  canDeactivate(target: GameComponent): boolean {
    if(!target.winner){
      return window.confirm('Do you really want to leave?');
    }
    return true;
  }

}
