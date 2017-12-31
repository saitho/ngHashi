import {Coords, Island} from '../app/Island';
import {ElementRef} from '@angular/core';
import {BoardDirections} from '../shared/helper/GameEngine';
import {Connection} from '../app/Connection';

/**
 * Structure of the Design configuration object
 */
export interface IDesignConfig {
  islandBorderSize: number;
  islandSize: number;
}

export abstract class AbstractDesign {
  protected config: IDesignConfig;
  protected canvasBgContext: CanvasRenderingContext2D;
  protected canvasBg: HTMLCanvasElement;
  protected canvasContext: CanvasRenderingContext2D;
  protected canvas: HTMLCanvasElement;
  protected editorMode = false;

  constructor(canvas: ElementRef|AbstractDesign, canvasBg: ElementRef, config: IDesignConfig) {
    if (canvas instanceof AbstractDesign) {
      // copy settings
      this.config = canvas.config;
      this.canvas = canvas.canvas;
      this.canvasBg = canvas.canvasBg;
      this.canvasContext = canvas.canvasContext;
      this.canvasBgContext = canvas.canvasBgContext;
      return;
    }

    this.config = config;
    this.canvas = canvas.nativeElement;
    this.canvasContext = this.canvas.getContext('2d');
    this.canvasBg = canvasBg.nativeElement;
    this.canvasBgContext = this.canvasBg.getContext('2d');
  }

  /**
   * Enabling editor mode might change how the design will handle islands
   */
  public enableEditorMode() {
    this.editorMode = true;
  }

  /**
   * Generates a connection object used by the design
   * @param {Island} island
   * @param {Island} connectedIsland
   * @param {BoardDirections} direction
   * @param {number} otherAxis
   * @return {Connection}
   */
  protected generateConnection(island: Island, connectedIsland: Island, direction: BoardDirections, otherAxis: number) {
    let otherAxisTile, startPx, endPx, start, end;
    if (direction === BoardDirections.HORIZONTAL) {
      // draw right connections on horizontal direction
      start = island.tileCoords.y;
      end = connectedIsland.tileCoords.y;
      startPx = island.pxCoordsEnd.x;
      endPx = connectedIsland.pxCoordsStart.x;
      otherAxisTile = island.tileCoords.x;
    } else if (direction === BoardDirections.VERTICAL) {
      // draw top connections on vertical direction
      start = island.tileCoords.x;
      end = connectedIsland.tileCoords.x;
      startPx = island.pxCoordsStart.y;
      endPx = connectedIsland.pxCoordsEnd.y;
      otherAxisTile = island.tileCoords.y;
    } else {
      throw new Error('Unknown direction.');
    }

    const connection: Connection = {
      direction: direction,
      island: island,
      connectedIsland: connectedIsland,
      start: start,
      end: end,
      otherAxis: otherAxisTile,
      startPx: startPx,
      endPx: endPx,
      otherAxisPx: otherAxis,
    };
    if (connection.start > connection.end) {
      // make sure the smallest number is start point
      const tmp = connection.end;
      connection.end = connection.start;
      connection.start = tmp;
    }
    return connection;
  }

  /**
   * Invoked in AbstractGameComponent after the contexts are set
   */
  public init() {
  }

  /**
   * Requests an image from a URL
   * @param imageUrl
   * @return {Promise<HTMLImageElement>}
   */
  protected preloadImage(imageUrl) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.addEventListener('load', () => {
        resolve(img);
      }, false);
      img.addEventListener('error', (e) => {
        reject(e);
      }, false);
      img.src = imageUrl;
    });
  }

  /**
   * Invoked before the game board is drawn in AbstractGameBoardComponent
   * @return {Promise<void>}
   */
  public beforeDrawGameBoard(): Promise<void> {
    return new Promise<void>((resolve) => {
      resolve();
    });
  }

  /**
   * draws an island onto the background canvas
   * Invoked after initialization of all islands in AbstractGameBoardComponent
   * @param {Island} island
   * @param drawnConnections
   */
  public abstract drawIsland(island: Island, drawnConnections);

  /**
   * Manipulates a given value to enable adjusting the space between two lines
   * @param {number} otherAxisValue
   * @param {number} i
   * @param {number} connectionsNum
   */
  protected abstract adjustOtherAxisValue(otherAxisValue: number, i: number, connectionsNum: number): number;

  /**
   * Draws a simple connection line on the background canvas
   * @param {Coords} moveTo
   * @param {Coords} lineTo
   * @param {BoardDirections} direction
   */
  protected drawConnectionLine(moveTo: Coords, lineTo: Coords, direction: BoardDirections) {
    this.canvasBgContext.beginPath();
    this.canvasBgContext.moveTo(moveTo.x, moveTo.y);
    this.canvasBgContext.lineTo(lineTo.x, lineTo.y);
    this.canvasBgContext.stroke();
    this.canvasBgContext.closePath();
  }

  /**
   * draws connections of an island on background canvas
   * @param island
   * @param direction
   * @param drawnConnections
   */
  protected drawConnections(island: Island, direction: BoardDirections, drawnConnections: Connection[]) {
    let axisValue, connections;
    if (direction === BoardDirections.HORIZONTAL) {
      // draw right connections on vertical horizontal
      connections = island.connections.right;
      axisValue = island.pxCoordsStart.y;
    } else if (direction === BoardDirections.VERTICAL) {
      // draw top connections on vertical direction
      connections = island.connections.top;
      axisValue = island.pxCoordsStart.x;
    } else {
      throw new Error('Unknown direction.');
    }

    for (let i = 0; i < connections.length; i++) {
      const otherAxis = this.adjustOtherAxisValue(axisValue, i, connections.length);
      const connection = this.generateConnection(island, connections[i], direction, otherAxis);
      drawnConnections.push(connection);

      let moveTo: Coords;
      let lineTo: Coords;
      if (connection.direction === BoardDirections.HORIZONTAL) {
        moveTo = {x: connection.startPx, y: connection.otherAxisPx};
        lineTo = {x: connection.endPx, y: connection.otherAxisPx};
      } else if (connection.direction === BoardDirections.VERTICAL) {
        moveTo = {x: connection.otherAxisPx, y: connection.startPx};
        lineTo = {x: connection.otherAxisPx, y: connection.endPx};
      }
      this.drawConnectionLine(moveTo, lineTo, connection.direction);
    }
  }
}
