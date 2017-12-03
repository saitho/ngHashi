import {Island} from "../../Island";
import {ElementRef} from "@angular/core";

export interface IDesignConfig {
  islandBorder: number;
  islandSize: number;
}

export abstract class AbstractDesign {
  protected config: IDesignConfig;
  protected canvasBgContext: CanvasRenderingContext2D;
  protected canvasBg: HTMLCanvasElement;

  constructor(canvas: ElementRef|AbstractDesign, config: IDesignConfig) {
    if (canvas instanceof AbstractDesign) {
      // copy settings
      this.config = canvas.config;
      this.canvasBg = canvas.canvasBg;
      this.canvasBgContext = canvas.canvasBgContext;
      return;
    }

    this.config = config;
    this.canvasBg = canvas.nativeElement;
    this.canvasBgContext = this.canvasBg.getContext('2d');
  }

  public abstract drawIsland(island: Island, drawnConnections);

  public getConfig() {
    return this.config;
  }
}
