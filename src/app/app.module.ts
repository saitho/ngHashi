import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import {AppRoutingModule} from "./app-routing.module";
import { LevelSelectComponent } from './level-select/level-select.component';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    LevelSelectComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
