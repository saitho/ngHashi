import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { GameSettingsComponent } from './game-settings/game-settings.component';
import {AppRoutingModule} from "./app-routing.module";
import { LevelSelectComponent } from './level-select/level-select.component';
import { GameScreenComponent } from './game-screen/game-screen.component';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    GameSettingsComponent,
    LevelSelectComponent,
    GameScreenComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
