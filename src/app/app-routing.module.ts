import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LevelSelectComponent} from "./level-select/level-select.component";
import {GameScreenComponent} from "./game-screen/game-screen.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: '/level_select',
    pathMatch: 'full'
  },
  { path: 'level_select', component: LevelSelectComponent },
  { path: 'play/:id', component: GameScreenComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
