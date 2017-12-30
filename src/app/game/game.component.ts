import {Component, Input, AfterViewInit} from '@angular/core';
import {AbstractMap} from "../maps/AbstractMap";
import {ActivatedRoute, NavigationStart, Router} from "@angular/router";
import {GameLevelsService} from "../../shared/services/GameLevelsService";
import AbstractGameBoardComponent from "../AbstractGameBoardComponent";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent extends AbstractGameBoardComponent implements AfterViewInit {
  @Input()
  protected map: AbstractMap = null;

  public message: string = 'Have fun! :)';
  public islandSize = 30;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private gameLevels: GameLevelsService) {
    super();

    // stop timer when navigation to an other route is started
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.map.stopTimer();
      }
    })
  }

  /**
   * Set map from ID or encoded JSON data
   */
  ngAfterViewInit() {
    this.route.params.subscribe((params) => {
      setTimeout(() => {
        if (isNaN(params.id)) {
          // treat as mapdata hash
          const mapData = JSON.parse(atob(params.id));
          this.map = new AbstractMap();
          this.map.importFromJSON(mapData);
        } else {
          // treat as id
          this.map = this.gameLevels.getLevel(params.id - 1);
        }
        super.ngAfterViewInit();
      });
    });
  }

  /**
   * Reset the map
   * @return {Promise<void>}
   */
  public async restart() {
    if (confirm('Do you really want to restart the game?')) {
      this.map.reset();
      await this.drawGameBoard();
    }
  }

  /**
   * @inheritDoc
   * @see removeConnectionOnCursorPos
   */
  mouseClick(e) {
    this.removeConnectionOnCursorPos(e);
  }

  /**
   * @inheritDoc
   */
  startBridgeDrawing(e) {
    this.startPosition.x = e.offsetX;
    this.startPosition.y = e.offsetY;
    this.started = this.gui.hasIsland(e.offsetX, e.offsetY);
  }

  /**
   * @inheritDoc
   */
  async stopBridgeDrawing() {
    if (!this.started) {
      return;
    }

    try {
      // pass start and stop ositions to GameEngine
      this.gui.putBridge(this.startPosition, this.stopPosition);
      this.message = 'Bridge set successfully.';
    } catch (e) {
      if (e.message) {
        this.message = e.message;
      } else {
        this.message = 'Invalid turn.';
      }
    }

    await this.drawGameBoard();
  }

  /**
   * @inheritDoc
   */
  duringBridgeDrawing(e) {
    if (!this.started) return;
    this.canvasContext.clearRect(0, 0, this.gameWidth, this.gameHeight);
    this.canvasContext.beginPath();
    this.canvasContext.moveTo(this.startPosition.x, this.startPosition.y);
    const dx = e.offsetX - this.startPosition.x;
    const dy = e.offsetY - this.startPosition.y;
    if (Math.abs(dx) > Math.abs(dy)) {
      this.canvasContext.lineTo(e.offsetX, this.startPosition.y);
      this.stopPosition.x = e.offsetX;
      this.stopPosition.y = this.startPosition.y;
    } else {
      this.canvasContext.lineTo(this.startPosition.x, e.offsetY);
      this.stopPosition.x = this.startPosition.x;
      this.stopPosition.y = e.offsetY;
    }
    this.canvasContext.stroke();
    this.canvasContext.closePath();
  }

  /**
   * @inheritDoc
   */
  drawGameBoard() {
    return new Promise<void>(resolve => {
      super.drawGameBoard()
        .then(() => {
          if (this.map.isSolved()) {
            this.message = 'Level solved.';
            this.map.stopTimer();
          } else if (this.drawnConnections.length) {
            // start timer if connections are drawn
            // -> user sets first connection
            // -> user returns to puzzle he already started
            this.map.startTimer();
          }
          resolve();
        })
        .catch(e => console.error(e));
    });
  }
}
