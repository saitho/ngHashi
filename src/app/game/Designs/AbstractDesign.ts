import {Island} from "../../Island";
import {ElementRef} from "@angular/core";
import {BoardDirections} from "../../../shared/helper/GameEngine";

interface IImageStorage {
  background: HTMLImageElement,
  island: HTMLImageElement,
  bridge_horizontal: HTMLImageElement,
  bridge_vertical: HTMLImageElement,
  bridge_horizontal_pattern: CanvasPattern,
  bridge_vertical_pattern: CanvasPattern
}

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

  public enableEditorMode() {
    this.editorMode = true;
  }
  public disableEditorMode() {
    this.editorMode = false;
  }

  protected generateConnection(island: Island, connectedIsland: Island, direction: BoardDirections, otherAxis: number) {
    let islandStartVar, connectedIslandEndName, tileVar, tileVarOtherAxis;
    if (direction == BoardDirections.HORIZONTAL) {
      // draw right connections on vertical horizontal
      islandStartVar = 'xEnd';
      connectedIslandEndName = 'xStart';
      tileVar = 'y';
      tileVarOtherAxis = 'x';
    } else if (direction == BoardDirections.VERTICAL) {
      // draw top connections on vertical direction
      islandStartVar = 'yStart';
      connectedIslandEndName = 'yEnd';
      tileVar = 'x';
      tileVarOtherAxis = 'y';
    } else {
      throw new Error('Unknown direction.');
    }

    let connection = {
      direction: direction,
      island: island,
      connectedIsland: connectedIsland,
      start: island.tileCoords[tileVar],
      end: connectedIsland.tileCoords[tileVar],
      otherAxis: island.tileCoords[tileVarOtherAxis],
      startPx: island[islandStartVar],
      endPx: connectedIsland[connectedIslandEndName],
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

  protected imageStorage: IImageStorage = {
    background: null,
    island: null,
    bridge_horizontal: null,
    bridge_vertical: null,
    bridge_horizontal_pattern: null,
    bridge_vertical_pattern: null
  };

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

  public init() {
  }

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

  public beforeDrawGameBoard(): Promise<void> {
    return new Promise<void>((resolve) => {
      resolve();
    });
  }

  public abstract drawIsland(island: Island, drawnConnections);

  public getConfig() {
    return this.config;
  }
}
