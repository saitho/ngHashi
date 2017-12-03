import {Class, Component, ElementRef, Input, OnInit} from '@angular/core';
import {GameComponent} from "../game/game.component";
import {SushiDesign} from "../game/Designs/SushiDesign";
import {GameThemes} from "../game/GameThemes";

@Component({
  selector: 'app-game-settings',
  templateUrl: './game-settings.component.html',
  styleUrls: ['./game-settings.component.css']
})
export class GameSettingsComponent implements OnInit {
  @Input()
  gameRef: GameComponent;

  constructor() { }

  ngOnInit() {
  }

  changeDesign(value) {
    this.gameRef.design = GameThemes.getTheme(value, this.gameRef.design);
    this.gameRef.drawGameBoard();
  }
  restart() {
    this.gameRef.restart();
  }

}
