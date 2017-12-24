import {Component, ViewChild, ElementRef, Input, AfterViewInit} from '@angular/core';
import {BoardDirections} from "../../shared/helper/GameEngine";
import {GameGUI} from "../../shared/helper/GameGUI";
import {Connection} from "../Connection";
import {AbstractDesign} from "./Designs/AbstractDesign";
import {GameThemes} from "../../shared/helper/GameThemes";
import {AbstractMap} from "../maps/AbstractMap";
import {ActivatedRoute} from "@angular/router";
import * as gameLevels from "../../shared/helper/GameLevels"

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements AfterViewInit {
  gui: GameGUI = new GameGUI();

  @Input()
  protected map: AbstractMap = null;

  constructor(
    private route: ActivatedRoute
  ) {}

  ngAfterViewInit() {
    this.route.params.subscribe((params) => {

      let defaultTheme = GameThemes.getTheme('Nikoli Classic', {
        canvas: this.canvas,
        canvasBg: this.canvasBg,
        config: {
          islandBorderSize: 2,
          islandSize: this.islandSize
        }
      });

      this.initGame(defaultTheme, gameLevels.default[params.id - 1]);
    });
  }

  @ViewChild('canvasBg') canvasBg: ElementRef;
  @ViewChild('canvasDraw') canvas: ElementRef;

  message: string = 'Have fun! :)';
  islandSize = 30;
  gameWidth_default = 600;
  gameHeight_default = 600;
  gameWidth;
  gameHeight;

  private design: AbstractDesign;

  canvasContext: CanvasRenderingContext2D;
  canvasBgContext: CanvasRenderingContext2D;

  started = false;
  startPosition = {x: -300, y: -300};
  stopPosition = {x: -300, y: -300};

  /**
   * saves drawn connections to be able to remove them later
   * @type {Array}
   */
  drawnConnections: Connection[] = [];

  public getDesign() {
    return this.design;
  }

  private initGame(design: AbstractDesign, map: AbstractMap) {
    this.design = design;
    this.gui.setMap(map);
    console.log('initGame');
    // set canvas sizes
    this.canvasBg.nativeElement.width = this.gameWidth_default;
    this.canvasBg.nativeElement.height = this.gameHeight_default;

    // save canvas contexts
    this.canvasBgContext = this.canvasBg.nativeElement.getContext('2d');
    this.canvasContext = this.canvas.nativeElement.getContext('2d');

    this.design.init();

    // Set default value if no value has been set by design
    if (this.canvasBg.nativeElement.width == 0) {
      this.canvasBg.nativeElement.width = this.gameWidth_default;
    }
    if (this.canvasBg.nativeElement.height == 0) {
      this.canvasBg.nativeElement.height = this.gameHeight_default;
    }

    // if size has change adjust dimensions
    if (
      (this.canvasBg.nativeElement.width != this.gameWidth) ||
      (this.canvasBg.nativeElement.height != this.gameHeight)
    ) {
      this.gameWidth = this.canvasBg.nativeElement.width;
      this.gameHeight = this.canvasBg.nativeElement.height;

      // trigger recalculation of island positions
      const map = this.gui.getMap().getData();
      for(let i=0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
          map[i][j].init = false;
        }
      }
      this.canvas.nativeElement.width = this.gameWidth;
      this.canvas.nativeElement.height = this.gameHeight;
    }

    // draw
    this.drawGameBoard();
  }

  public restart() {
    if (confirm('Do you really want to restart the game?')) {
      this.gui.getMap().reset();
      this.drawGameBoard();
    }
  }

  private getConnectionsFromCursorPos(e): Connection[] {
    let values = [];
    this.drawnConnections.forEach(value => {
      let offsetType, offsetTypeRange = '';
      if (value.direction === BoardDirections.VERTICAL) {
        offsetType = 'offsetY';
        offsetTypeRange = 'offsetX';
      } else {
        offsetType = 'offsetX';
        offsetTypeRange = 'offsetY';
      }

      // skip if other click is not in a specified range
      // 10 pixel offset
      if (!(value.otherAxis - 10 < e[offsetTypeRange] && value.otherAxis + 10 > e[offsetTypeRange])) {
        return;
      }

      // the tile should be between the line... also switch start and end as those depend on how the line was drawn...
      if (
        (e[offsetType] > value.start && e[offsetType] < value.end) ||
        (e[offsetType] > value.end && e[offsetType] < value.start)
      ) {
        values.push(value);
      }
    });
    return values;
  }

  /**
   * unset "started" here
   * - as onClick is triggered after onMouseDown
   * - to avoid removing a line while drawing one and hovering on an existing line while releasing the mouse button
   * @param e
   */
  mouseClick(e) {
    if (this.started) {
      this.started = false;
      return;
    }
    // Check for a connection that goes through the tile
    const connections = this.getConnectionsFromCursorPos(e);
    if (connections.length == 0) {
      return;
    }
    // drop one connection
    this.gui.removeBridge(connections[0]);
    this.drawGameBoard();
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
  stopBridgeDrawing() {
    if (!this.started) {
      return;
    }

    try {
      // pass start and stop ositions to GameEngine
      this.gui.putBridge(this.startPosition.x, this.startPosition.y, this.stopPosition.x, this.stopPosition.y);
    } catch(e) {
      if (e.message) {
        this.message = e.message;
      } else {
        this.message = 'Invalid turn.';
      }
    }

    this.drawGameBoard();
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
    const map = this.gui.getMap().getData();

    // clear drawing canvas
    this.canvasContext.clearRect(0,0, this.gameWidth, this.gameHeight);
    // clear background canvas
    this.canvasBgContext.clearRect(0,0, this.gameWidth, this.gameHeight);

    this.design.beforeDrawGameBoard()
      .then(() => {
        // distribute game window size amongst all map tiles and keep some space around (length+1)
        const xPerRect = this.gameWidth/(map.length+1);
        const yPerRect = this.gameHeight/(map.length+1);

        // clear connections
        this.drawnConnections = [];

        // Draw islands
        for(let i=0; i < map.length; i++) {
          for(let j=0; j < map[i].length; j++) {
            const island = map[j][i]; // switch j and i to keep the order from array in rendering
            if (island.init == false) {
              island.xStart = xPerRect*3/4 + i*xPerRect;
              island.yStart = yPerRect*3/4 + j*yPerRect;
              island.xEnd = island.xStart + this.islandSize;
              island.yEnd = island.yStart + this.islandSize;
              island.init = true;
            }
            this.design.drawIsland(island, this.drawnConnections);
          }
        }

        // Check if game is completed
        if (this.gui.getMap().isSolved()) {
          this.message = 'Level solved.';
        }
    })
      .catch((error) => {
      console.log('Error in beforeDrawGameBoard hook', error);
      });
  }
}
