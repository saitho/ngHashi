import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import {AppRoutingModule} from './app-routing.module';
import { LevelSelectComponent } from './level-select/level-select.component';
import { EditorComponent } from './editor/editor.component';
import {HttpClientModule} from '@angular/common/http';
import {GameLevelsService} from '../shared/services/GameLevelsService';
import {UrlEncodePipe} from '../shared/pipes/UrlEncodePipe';
import {NgbModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgbModalStack} from '@ng-bootstrap/ng-bootstrap/modal/modal-stack';
import {NgbModalBackdrop} from '@ng-bootstrap/ng-bootstrap/modal/modal-backdrop';
import {FormsModule} from '@angular/forms';
import {TimerFormatPipe} from '../shared/pipes/TimerFormatPipe';
import { GameHelpComponent } from './game-help/game-help.component';
import {Ng2EventsModule} from 'ng2-events';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    LevelSelectComponent,
    EditorComponent,
    UrlEncodePipe,
    TimerFormatPipe,
    GameHelpComponent
  ],
  imports: [
    NgbModule.forRoot(),
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    Ng2EventsModule
  ],
  providers: [
    GameLevelsService,
    NgbModal,
    NgbModalStack
  ],
  entryComponents: [
    NgbModalBackdrop
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
