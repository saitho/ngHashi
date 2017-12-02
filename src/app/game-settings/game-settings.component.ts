import {Component, Input, OnInit} from '@angular/core';
import {GameComponent} from "../game/game.component";

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

  restart() {
    this.gameRef.restart();
  }

}
