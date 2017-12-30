import {GameGUI} from "../shared/helper/GameGUI";
import {AbstractMap} from "./maps/AbstractMap";
import {AfterViewInit, ElementRef, OnInit, ViewChild} from "@angular/core";
import {AbstractDesign} from "../_designs/AbstractDesign";
import {Connection} from "./Connection";
import {GameThemes} from "../shared/helper/GameThemes";
import {BoardDirections, GameEngine} from "../shared/helper/GameEngine";

export default abstract class AbstractGameBoardComponent implements OnInit, AfterViewInit {
  protected map: AbstractMap = null;
  @ViewChild('canvasBg') canvasBg: ElementRef;
  @ViewChild('canvasDraw') canvas: ElementRef;
  gameWidth_default = 600;
  gameHeight_default = 600;
  abstract islandSize;
  gameWidth;
  gameHeight;
  canvasContext: CanvasRenderingContext2D;
  canvasBgContext: CanvasRenderingContext2D;
  protected design: AbstractDesign;
  protected started = false;
  protected startPosition = {x: -300, y: -300};
  protected stopPosition = {x: -300, y: -300};

  protected gameBoardConfig = {enableGrid: false, perRectMultiplier: 0.75, perRectOffset: 0};

  /**
   * saves drawn connections to be able to remove them later
   * @type {Array}
   */
  protected drawnConnections: Connection[] = [];

  protected gui: GameGUI = new GameGUI();

  /**
   * Assign canvas contexts
   */
  ngOnInit() {
    this.canvasBgContext = this.canvasBg.nativeElement.getContext('2d');
    this.canvasContext = this.canvas.nativeElement.getContext('2d');
  }

  /**
   * Entry point
   * Load default theme and initialize game
   */
  ngAfterViewInit() {
    setTimeout(() => {
      let defaultTheme = GameThemes.getTheme(this.map.themeName, {
        canvas: this.canvas,
        canvasBg: this.canvasBg,
        config: {
          islandBorderSize: 2,
          islandSize: this.islandSize
        }
      });
      this.initGame(defaultTheme);
    });
  }

  /**
   * Removes a connection that is on the cursor position
   * @param e
   * @return {Promise<void>}
   */
  protected async removeConnectionOnCursorPos(e) {
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
    await this.drawGameBoard();
  }

  /**
   * Returns an array of connections that are on the cursor position
   * @param e
   * @return {Connection[]}
   */
  protected getConnectionsFromCursorPos(e): Connection[] {
    return this.drawnConnections.filter((connection) => {
      let offsetType, offsetTypeRange = '';
      if (connection.direction === BoardDirections.VERTICAL) {
        offsetType = 'offsetY';
        offsetTypeRange = 'offsetX';
      } else {
        offsetType = 'offsetX';
        offsetTypeRange = 'offsetY';
      }

      // skip if other click is not in a specified range (10 pixel offset)
      if (!(connection.otherAxisPx - 10 < e[offsetTypeRange] && connection.otherAxisPx + 10 > e[offsetTypeRange])) {
        return false;
      }

      // the tile should be between the line...
      if (connection.direction === BoardDirections.VERTICAL) {
        return (e[offsetType] > connection.endPx && e[offsetType] < connection.startPx);
      } else {
        return (e[offsetType] > connection.startPx && e[offsetType] < connection.endPx);
      }
    });
  }

  /**
   * Invoked after the view was initialized
   * Sets and initializes design and game map
   * @param {AbstractDesign} design
   */
  protected initGame(design: AbstractDesign) {
    this.design = design;
    this.gui.setMap(this.map);
    // reset canvas sizes
    this.canvasBg.nativeElement.width = 0;
    this.canvasBg.nativeElement.height = 0;

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
      const map = this.map.getData();
      for(let i=0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
          map[i][j].init = false;
        }
      }
    }
    this.canvas.nativeElement.width = this.canvasBg.nativeElement.width;
    this.canvas.nativeElement.height = this.canvasBg.nativeElement.height;

    // draw
    this.drawGameBoard();
  }

  /**
   * Invoked on mouse click on drawing canvas
   * Used for removing lines functionality
   * @param e
   */
  public abstract mouseClick(e);

  /**
   * Invoked on mouse release on drawing canvas
   * Used for drawing bridges
   * @param e
   */
  public abstract startBridgeDrawing(e);

  /**
   * Invoked on mouse click on drawing canvas
   * Used for drawing bridges
   * @param e
   */
  public abstract stopBridgeDrawing(e);

  /**
   * Invoked on mouse down on drawing canvas
   * Used for updating the drawing canvas while drawing a bridge
   * @param e
   */
  public abstract duringBridgeDrawing(e);

  /**
   * Clears both canvases
   */
  protected clearGameBoard() {
    // clear drawing canvas
    this.canvasContext.clearRect(0,0, this.gameWidth, this.gameHeight);
    // clear background canvas
    this.canvasBgContext.clearRect(0,0, this.gameWidth, this.gameHeight);
  }

  /**
   * Draws a grid onto the background canvas
   */
  protected drawGrid() {
    this.canvasBgContext.lineWidth = 2;
    this.canvasBgContext.beginPath();
    this.canvasBgContext.strokeStyle = 'lightgrey';

    // top border
    this.canvasBgContext.moveTo(0, 1);
    this.canvasBgContext.lineTo(this.gameWidth, 1);
    this.canvasBgContext.stroke();

    // bottom border
    this.canvasBgContext.moveTo(0, this.gameHeight - 2);
    this.canvasBgContext.lineTo(this.gameWidth, this.gameHeight - 2);
    this.canvasBgContext.stroke();

    // left border
    this.canvasBgContext.moveTo(1, 0);
    this.canvasBgContext.lineTo(1, this.gameHeight);
    this.canvasBgContext.stroke();

    // right border
    this.canvasBgContext.moveTo(this.gameWidth - 2, 0);
    this.canvasBgContext.lineTo(this.gameWidth - 2, this.gameHeight);
    this.canvasBgContext.stroke();

    for (let i = 0; i < this.map.getData().length; i++) {
      // vertical lines
      this.canvasBgContext.moveTo(this.gameWidth * (i+1) / this.map.getData().length, 0);
      this.canvasBgContext.lineTo(this.gameWidth * (i+1) / this.map.getData().length, this.gameHeight);
      this.canvasBgContext.stroke();

      // horizontal lines
      this.canvasBgContext.moveTo(0, this.gameHeight * (i+1) / this.map.getData().length);
      this.canvasBgContext.lineTo(this.gameWidth, this.gameHeight * (i+1) / this.map.getData().length);
      this.canvasBgContext.stroke();
    }

    this.canvasBgContext.closePath();
  }

  /**
   * Draws the game board onto the background canvas
   * @return {Promise<void>}
   */
  public drawGameBoard() {
    return new Promise<void>((resolve) => {
      this.started = false;
      const map = this.map.getData();
      this.clearGameBoard();

      if (this.gameBoardConfig.enableGrid) {
        this.drawGrid();
      }
      this.design.beforeDrawGameBoard()
        .then(() => {
          // distribute game window size amongst all map tiles and keep some space around (length+1)
          const xPerRect = this.gameWidth/(map.length+1);
          const yPerRect = this.gameHeight/(map.length+1);

          // clear connections
          this.drawnConnections = [];

          // Init islands
          for(let i=0; i < map.length; i++) {
            for(let j=0; j < map[i].length; j++) {
              const island = map[j][i]; // switch j and i to keep the order from array in rendering
              if (island.init) {
                continue;
              }
              island.xStart = xPerRect * this.gameBoardConfig.perRectMultiplier + i * (xPerRect + this.gameBoardConfig.perRectOffset);
              island.yStart = yPerRect * this.gameBoardConfig.perRectMultiplier + j * (yPerRect + this.gameBoardConfig.perRectOffset);
              island.xEnd = island.xStart + this.islandSize;
              island.yEnd = island.yStart + this.islandSize;
              island.tileCoords = {x: j, y: i};
              island.init = true;
            }
          }

          // Draw islands
          for(let i=0; i < map.length; i++) {
            for(let j=0; j < map[i].length; j++) {
              this.design.drawIsland(map[j][i], this.drawnConnections);
            }
          }
          GameEngine.setConnections(this.drawnConnections);
          resolve();
        })
        .catch((error) => {
          console.log('Error in beforeDrawGameBoard hook', error);
        });
    });
  }
}
