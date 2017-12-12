import { Routes, RouterModule } from "@angular/router";
import { ModuleWithProviders } from "@angular/core";
import { MenuComponent } from "./menu/menu.component";
import { GameComponent } from "./game/game.component";
import { ConfirmLeaveGuard } from "./game/confirm-leave-guard";

const appRoutes: Routes = [
  { path: '', pathMatch: 'full', component: MenuComponent },
  { path: 'game', redirectTo: 'game/singleplayer', pathMatch: 'full' },
  { path: 'game/:gametype', component: GameComponent, canDeactivate: [ConfirmLeaveGuard], pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
