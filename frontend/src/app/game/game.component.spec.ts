import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameComponent } from './game.component';
import {TimerFormatPipe} from '../../shared/pipes/TimerFormatPipe';
import {Router, ActivatedRoute} from '@angular/router';
import {GameLevelsService} from '../../shared/services/GameLevelsService';
import {HttpClientModule} from '@angular/common/http';
import {LevelSelectComponent} from '../level-select/level-select.component';
import {GameHelpComponent} from '../game-help/game-help.component';
import {NgbModal, NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import {NgbModalStack} from '@ng-bootstrap/ng-bootstrap/modal/modal-stack';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import {NgbModalBackdrop} from '@ng-bootstrap/ng-bootstrap/modal/modal-backdrop';
import {RouterTestingModule} from '@angular/router/testing';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

class MockRouter {
  private eventsSubject = new BehaviorSubject(this.testEvents);
  private _testEvents: {};

  readonly events = this.eventsSubject.asObservable();

  get testEvents() {
    return this._testEvents;
  }
  set testEvents(newParams: any) {
    this._testEvents = newParams;
    this.eventsSubject.next(newParams);
  }
}

class MockActivatedRoute {
  private paramsSubject = new BehaviorSubject(this.testParams);
  private _testParams: {};

  params = this.paramsSubject.asObservable();

  get testParams() {
    return this._testParams;
  }
  set testParams(newParams: any) {
    this._testParams = newParams;
    this.paramsSubject.next(newParams);
  }
}

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;
  let activeRoute: MockActivatedRoute;
  let router: MockRouter;

  beforeEach(() => {
    activeRoute = new MockActivatedRoute();
    router = new MockRouter();
  });

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        GameComponent,
        GameHelpComponent,
        LevelSelectComponent,
        TimerFormatPipe
      ],
      imports: [
        NgbModalModule,
        HttpClientModule,
        RouterTestingModule.withRoutes([]),
      ],
      providers: [
        GameLevelsService,
        NgbModal,
        NgbModalStack,
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: activeRoute }
      ]
    });

    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [NgbModalBackdrop]
      }
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
