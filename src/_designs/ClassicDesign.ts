import {AbstractDesign, IDesignConfig} from "./AbstractDesign";
import {Coords, Island} from "../app/Island";
import {BoardDirections} from "../shared/helper/GameEngine";
import {ElementRef} from "@angular/core";

export class ClassicDesign extends AbstractDesign {
  constructor(canvas: ElementRef, canvasBg: ElementRef, config: IDesignConfig) {
    super(canvas, canvasBg, config);
  }

  /**
   * @inheritDoc
   * @inheritDoc
   */
  public beforeDrawGameBoard(): Promise<void> {
    return new Promise<void>((resolve) => {
      // set font for background canvas
      this.canvasBgContext.font = '16px sans-serif';
      this.canvasBgContext.textBaseline = 'middle';
      this.canvasBgContext.textAlign = 'center';
      resolve();
    });
  }

  /**
   * @inheritDoc
   * @inheritDoc
   */
  drawIsland(island: Island, drawnConnections) {
    if (island.bridges == 0) {
      return;
    }

    // circle
    this.canvasBgContext.beginPath();
    this.canvasBgContext.arc(
      island.xStart+this.config.islandSize/2,
      island.yStart+this.config.islandSize/2,
      this.config.islandSize/2,
      0,
      2 * Math.PI
    );
    this.canvasBgContext.fillStyle = island.isComplete() ? 'lightblue' : 'white';
    this.canvasBgContext.fill();
    this.canvasBgContext.lineWidth = 2;
    this.canvasBgContext.strokeStyle = 'black';
    this.canvasBgContext.stroke();
    this.canvasBgContext.closePath();

    // text
    if (!this.editorMode || (island.bridges == island.countConnections())) {
      this.canvasBgContext.fillStyle = 'black';
      this.canvasBgContext.fillText(
        island.bridges.toString(),
        island.xStart+this.config.islandSize/2,
        island.yStart+this.config.islandSize/2
      );
    }

    this.drawConnections(island, BoardDirections.HORIZONTAL, drawnConnections);
    this.drawConnections(island, BoardDirections.VERTICAL, drawnConnections);
  }

  /**
   * @inheritDoc
   */
  protected adjustOtherAxisValue(otherAxisValue: number, i: number, connectionsNum: number) {
    let value = otherAxisValue + this.config.islandSize/2;
    if (connectionsNum == 2) {
      value = otherAxisValue + this.config.islandSize*(i+1)/3;
    }
    return value;
  }
}
