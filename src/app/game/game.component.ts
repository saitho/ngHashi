import {Component, ViewChild, ElementRef, OnInit} from '@angular/core';
import map from "../maps/GameMaps";
import {Island} from "../Island";
import {BoardDirections, GameEngine} from "./GameEngine";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  game: GameEngine;
  constructor() {
    this.game = new GameEngine();
  }

  @ViewChild('canvasBg') canvasBg: ElementRef;
  @ViewChild('canvasDraw') canvas: ElementRef;

  islandSize = 30;
  gameWidth = 600;
  gameHeight = 600;

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
  drawnConnections: any[] = [];

  mouseClick(e) {
    console.log('mouseclick', this.game.hasIsland(e.offsetX, e.offsetY));
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
   */
  stopBridgeDrawing() {
    if (!this.started) {
      return;
    }
    this.started = false;

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
    // clear drawing canvas
    this.canvasContext.clearRect(0,0, this.gameWidth, this.gameHeight);
    // clear background canvas
    this.canvasBgContext.clearRect(0,0, this.gameWidth, this.gameHeight);

    // distribute game window size amongst all map tiles and keep some space around (length+1)
    const xPerRect = this.gameWidth/(map.length+1);
    const yPerRect = this.gameHeight/(map.length+1);

    // Draw islands
    for(let i=0; i < map.length; i++) {
      for(let j=0; j < map[i].length; j++) {
        const island = map[i][j];
        if (island.init == false) {
          island.xStart = xPerRect*3/4 + i*xPerRect;
          island.yStart = yPerRect*3/4 + j*yPerRect;
          island.xEnd = island.xStart + this.islandSize;
          island.yEnd = island.yStart + this.islandSize;
          island.init = true;
        }
        this.drawIsland(island);
      }
    }
  }

  /**
   * draws connections of an island on background canvas
   * @param island
   * @param direction
   */
  drawConnections(island, direction) {
    let connections = island.connections[direction];
    for (let i = 0; i < connections.length; i++) {
      let connectedIsland = connections[i];
      let connection;
      if (direction == 'right') {
        connection = {
          direction: BoardDirections.HORIZONTAL,
          otherAxis: connections.length == 2 ? island.yStart + this.islandSize/3 : island.yStart + this.islandSize/2,
          start: island.xEnd,
          end: connectedIsland.xStart
        };
      } else if (direction == 'top') {
        connection = {
          direction: BoardDirections.VERTICAL,
          otherAxis: connections.length == 2 ? island.xStart + this.islandSize/3 : island.xStart + this.islandSize/2,
          start: island.yStart,
          end: connectedIsland.yEnd
        };
      } else {
        throw new Error('Unknown direction.');
      }

      this.drawnConnections.push(connection);
      if (connection.direction == BoardDirections.HORIZONTAL) {
        this.canvasBgContext.moveTo(connection.start, connection.otherAxis);
        this.canvasBgContext.lineTo(connection.end, connection.otherAxis);
      } else if (connection.direction == BoardDirections.VERTICAL) {
        this.canvasBgContext.moveTo(connection.otherAxis, connection.start);
        this.canvasBgContext.lineTo(connection.otherAxis, connection.end);
      }
      this.canvasBgContext.stroke();
    }
  }

  /**
   * draws an island onto the background canvas
   * @param {Island} island
   */
  drawIsland(island: Island) {
    if (island.bridges == 0) {
      return;
    }
    this.canvasBgContext.strokeRect(island.xStart, island.yStart, this.islandSize, this.islandSize);
    this.canvasBgContext.fillText(island.bridges.toString(), island.xStart+this.islandSize/2, island.yStart+this.islandSize/2);

    this.drawConnections(island, 'right');
    this.drawConnections(island, 'top');
  }

  ngOnInit() {
    // set canvas sizes
    this.canvas.nativeElement.width = this.gameWidth;
    this.canvas.nativeElement.height = this.gameHeight;
    this.canvasBg.nativeElement.width = this.gameWidth;
    this.canvasBg.nativeElement.height = this.gameHeight;

    // save canvas contexts
    this.canvasContext = this.canvas.nativeElement.getContext('2d');
    this.canvasBgContext = this.canvasBg.nativeElement.getContext('2d');

    // set font for background canvas
    this.canvasBgContext.font = '16px sans-serif';
    this.canvasBgContext.textBaseline = 'middle';
    this.canvasBgContext.textAlign = 'center';

    // draw
    this.drawGameBoard();
  }

}
