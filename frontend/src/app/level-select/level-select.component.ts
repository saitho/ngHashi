import { Component } from '@angular/core';
import {GameLevelsService} from '../../shared/services/GameLevelsService';
import {AbstractMap} from '../maps/AbstractMap';

@Component({
  selector: 'app-level-select',
  templateUrl: './level-select.component.html',
  styleUrls: ['./level-select.component.css']
})
export class LevelSelectComponent {
  levels: AbstractMap[];

  constructor(private gameLevels: GameLevelsService) {
    gameLevels.loadLevels().subscribe((maps) => {
      this.levels = maps;
    });
  }
}
