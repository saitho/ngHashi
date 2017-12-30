import {Component, Input, AfterViewInit} from '@angular/core';
import {AbstractMap} from "../maps/AbstractMap";
import {ActivatedRoute} from "@angular/router";
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

  constructor(
    private route: ActivatedRoute,
    private gameLevels: GameLevelsService
  ) {
    super();
  }

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

  public getDesign() {
    return this.design;
  }

  public async restart() {
    if (confirm('Do you really want to restart the game?')) {
      this.gui.getMap().reset();
      await this.drawGameBoard();
    }
  }

  /**
   * unset "started" here
   * - as onClick is triggered after onMouseDown
   * - to avoid removing a line while drawing one and hovering on an existing line while releasing the mouse button
   * @param e
   */
  mouseClick(e) {
    this.removeConnectionOnCursorPos(e);
  }

  /**
   * Save current position and enable "bridge setting" mode
   * triggered when the the player starts drawing the bridge (mousedown)
   */
  startBridgeDrawing(e) {
    this.startPosition.x = e.offsetX;
    this.startPosition.y = e.offsetY;
    this.started = this.gui.hasIsland(e.offsetX, e.offsetY);
  }

  /**
   * Disable "bridge setting" mode and pass the positions to the GameEngine
   * triggered when the the player stops drawing the bridge (mouseup)
   * Note: disabling "started" was moved to mouseClick as this is triggered after mouseDown...
   */
  async stopBridgeDrawing() {
    if (!this.started) {
      return;
    }

    try {
      // pass start and stop ositions to GameEngine
      this.gui.putBridge(this.startPosition.x, this.startPosition.y, this.stopPosition.x, this.stopPosition.y);
      this.message = 'Bridge set successfully.';
    } catch(e) {
      if (e.message) {
        this.message = e.message;
      } else {
        this.message = 'Invalid turn.';
      }
    }

    await this.drawGameBoard();
  }

  /**
   * triggered while the bridge is being drawn by the player (mousemove)
   * @param e
   */
  duringBridgeDrawing(e) {
    if (!this.started) return;
    this.canvasContext.clearRect(0,0, this.gameWidth, this.gameHeight);
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
   * draws the game board
   */
  drawGameBoard() {
    return new Promise<void>(resolve => {
      super.drawGameBoard()
        .then(() => {
          if (this.gui.getMap().isSolved()) {
            this.message = 'Level solved.';
          }
          resolve();
        })
        .catch(e => console.error(e));
    });
  }
}
