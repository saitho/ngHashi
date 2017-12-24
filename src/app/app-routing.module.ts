import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LevelSelectComponent} from "./level-select/level-select.component";
import {GameComponent} from "./game/game.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: '/level_select',
    pathMatch: 'full'
  },
  { path: 'level_select', component: LevelSelectComponent },
  { path: 'play/:id', component: GameComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
