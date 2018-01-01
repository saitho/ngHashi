import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelSelectComponent } from './level-select.component';
import {RouterTestingModule} from '@angular/router/testing';
import {GameLevelsService} from '../../shared/services/GameLevelsService';
import {HttpClientModule} from '@angular/common/http';
import {GameHelpComponent} from '../game-help/game-help.component';

describe('LevelSelectComponent', () => {
  let component: LevelSelectComponent;
  let fixture: ComponentFixture<LevelSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LevelSelectComponent,
        GameHelpComponent
      ],
      imports: [
        RouterTestingModule,
        HttpClientModule
      ],
      providers: [
        GameLevelsService,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
