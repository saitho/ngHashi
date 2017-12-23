import { Component, OnInit } from '@angular/core';
import * as gameLevels from "../../shared/helper/GameLevels";

@Component({
  selector: 'app-level-select',
  templateUrl: './level-select.component.html',
  styleUrls: ['./level-select.component.css']
})
export class LevelSelectComponent implements OnInit {
  levels = gameLevels.default;

  constructor() { }

  ngOnInit() {
  }

}
