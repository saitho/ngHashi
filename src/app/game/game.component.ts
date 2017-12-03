import {Component, ViewChild, ElementRef, OnInit} from '@angular/core';
import {BoardDirections, GameEngine} from "./GameEngine";
import {GameGUI} from "./GameGUI";
import {Connection} from "../Connection";
import {AbstractDesign} from "./Designs/AbstractDesign";
import {GameThemes} from "./GameThemes";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  game: GameGUI;
  constructor() {
    this.game = new GameGUI( new GameEngine() );
  }

  @ViewChild('canvasBg') canvasBg: ElementRef;
  @ViewChild('canvasDraw') canvas: ElementRef;

  islandSize = 30;
  gameWidth_default = 600;
  gameHeight_default = 600;
  gameWidth;
  gameHeight;

  private design: AbstractDesign;

  canvasContext: CanvasRenderingContext2D;
  canvasBgContext: CanvasRenderingContext2D;

  started = false;
  prvX = -300;
  prvY = -300;
  lstX = -300;
  lstY = -300;

  /**
   * saves drawn connections to be able to remove them later
   * @type {Array}
   */
  drawnConnections: Connection[] = [];

  public getDesign() {
    return this.design;
  }

  public setDesign(design: AbstractDesign) {
    this.design = design;

    this.canvasBg.nativeElement.width = 0;
    this.canvasBg.nativeElement.height = 0;

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
      const map = this.game.getMap().getData();
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

  ngOnInit() {
    // set canvas sizes
    this.canvasBg.nativeElement.width = this.gameWidth_default;
    this.canvasBg.nativeElement.height = this.gameHeight_default;

    // save canvas contexts
    this.canvasBgContext = this.canvasBg.nativeElement.getContext('2d');
    this.canvasContext = this.canvas.nativeElement.getContext('2d');

    const design = GameThemes.getTheme('Nikoli Classic', {
      canvas: this.canvas,
      canvasBg: this.canvasBg,
      config: {
        islandBorderSize: 2,
        islandSize: this.islandSize
      }
    });
    this.setDesign(design);
  }

  public restart() {
    if (confirm('Do you really want to restart the game?')) {
      this.game.getMap().reset();
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
    this.game.removeBridge(connections[0]);
    this.drawGameBoard();
  }

  /**
   * Save current position and enable "bridge setting" mode
   * triggered when the the player starts drawing the bridge (mousedown)
   */
  startBridgeDrawing(e) {
    this.prvX = e.offsetX;
    this.prvY = e.offsetY;
    this.started = this.game.hasIsland(e.offsetX, e.offsetY);
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
      // pass start (prvX, prvY) and stop (lstX, lstY) positions to GameEngine
      this.game.putBridge(this.prvX, this.prvY, this.lstX, this.lstY);
    } catch(e) {
      console.log('Invalid turn: ', e);
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
    this.canvasContext.moveTo(this.prvX, this.prvY);
    const dx = e.offsetX - this.prvX;
    const dy = e.offsetY - this.prvY;
    if (Math.abs(dx) > Math.abs(dy)) {
      this.canvasContext.lineTo(e.offsetX, this.prvY);
      this.lstX = e.offsetX;
      this.lstY = this.prvY;
    } else {
      this.canvasContext.lineTo(this.prvX, e.offsetY);
      this.lstX = this.prvX;
      this.lstY = e.offsetY;
    }
    this.canvasContext.stroke();
    this.canvasContext.closePath();
  }

  /**
   * draws the game board
   */
  drawGameBoard() {
    const map = this.game.getMap().getData();

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
    })
      .catch(() => {
      console.log('Error in beforeDrawGameBoard hook');
      });
  }
}
