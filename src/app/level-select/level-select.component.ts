import { Component, OnInit } from '@angular/core';
import {GameLevelsService} from "../../shared/services/GameLevelsService";
import {AbstractMap} from "../maps/AbstractMap";

@Component({
  selector: 'app-level-select',
  templateUrl: './level-select.component.html',
  styleUrls: ['./level-select.component.css']
})
export class LevelSelectComponent implements OnInit {
  levels: AbstractMap[];

  constructor(
    private gameLevels: GameLevelsService
  ) {
    this.levels = gameLevels.getLevels();
    console.log(this.levels);
  }

  ngOnInit() {
  }

}
