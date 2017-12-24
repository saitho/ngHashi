import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import {AppRoutingModule} from "./app-routing.module";
import { LevelSelectComponent } from './level-select/level-select.component';
import { EditorComponent } from './editor/editor.component';
import {HttpClientModule} from "@angular/common/http";
import {GameLevelsService} from "../shared/services/GameLevelsService";

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    LevelSelectComponent,
    EditorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    GameLevelsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
