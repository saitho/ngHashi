import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {GameComponent} from "../game/game.component";
import DefaultMap from "../maps/DefaultMap";
import {ActivatedRoute} from "@angular/router";
import * as gameLevels from "../../shared/helper/GameLevels";

@Component({
  selector: 'app-game-screen',
  template: '<section id="game" [style.width.px]="game.gameWidth" [style.height.px]="game.gameHeight">' +
  '<app-game #game></app-game>' +
  '</section>\n' +
  '<section id="settings">' +
  '<app-game-settings [gameRef]="game"></app-game-settings>' +
  '</section>',
  styles: ['./game-screen.component.css']
})
export class GameScreenComponent implements OnInit, AfterViewInit {

  @ViewChild(GameComponent) gameComponent;

  constructor(
    private route: ActivatedRoute
  ) {
  }

  ngAfterViewInit() {
    this.route.params.subscribe((params) => {
      setTimeout(() => {
        this.gameComponent.setMap(gameLevels.default[params.id - 1]);
      });
    });
  }

  ngOnInit() {


    // this.componentRequestLoader.addComponent<GameComponent>(GameComponent, ['id', 'id']);
  }

}
