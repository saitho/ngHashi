import {Island} from "../../Island";

export interface IDesignConfig {
  islandBorder: number;
  islandSize: number;
}

export abstract class AbstractDesign {
  protected config: IDesignConfig;
  protected canvasBgContext: CanvasRenderingContext2D;

  constructor(context: CanvasRenderingContext2D, config: IDesignConfig) {
    this.config = config;
    this.canvasBgContext = context;
  }

  public abstract drawIsland(island: Island, drawnConnections);
}
