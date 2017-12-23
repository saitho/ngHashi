import {Component, Input, OnInit} from '@angular/core';
import {GameComponent} from "../game/game.component";
import {GameThemes} from "../../shared/helper/GameThemes";
import * as gameLevels from "../../shared/helper/GameLevels";

@Component({
  selector: 'app-game-settings',
  templateUrl: './game-settings.component.html',
  styleUrls: ['./game-settings.component.css']
})
export class GameSettingsComponent implements OnInit {
  @Input()
  gameRef: GameComponent;
  themes = GameThemes.getThemes();
  levels = gameLevels.default;

  constructor() { }

  ngOnInit() {
  }

  changeDesign(value) {
    this.gameRef.setDesign(GameThemes.getTheme(value, this.gameRef.getDesign()));
    this.gameRef.drawGameBoard();
  }
  restart() {
    this.gameRef.restart();
  }

}
