import {IDesignConfig} from "./AbstractDesign";
import {Island} from "../app/Island";
import {BoardDirections} from "../shared/helper/GameEngine";
import {ElementRef} from "@angular/core";
import {AbstractGraphicalDesign} from "./AbstractGraphicalDesign";

export class WurzelimperiumDesign extends AbstractGraphicalDesign {
  constructor(canvas: ElementRef, canvasBg: ElementRef, config: IDesignConfig) {
    super(canvas, canvasBg, config);

    // set font for background canvas
    this.canvasBgContext.font = '16px sans-serif';
    this.canvasBgContext.textBaseline = 'middle';
    this.canvasBgContext.textAlign = 'center';
  }

  /**
   * @inheritDoc
   */
  public init() {
    this.canvasBg.width = 720;
    this.canvasBg.height = 640;
  }

  /**
   * @inheritDoc
   */
  public beforeDrawGameBoard(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.canvasContext.lineWidth = 5;
      this.canvasContext.strokeStyle = 'white';

      const background = this.preloadImage('assets/design/wurzelimperium/garten_hintergrund.png');
      const island = this.preloadImage('assets/design/wurzelimperium/bauernhof.png');
      const bridge_horizontal = this.preloadImage('assets/design/wurzelimperium/street_horizontal.jpg');
      const bridge_vertical = this.preloadImage('assets/design/wurzelimperium/street_vertical.jpg');

      Promise.all([background, island, bridge_horizontal, bridge_vertical])
        .then((values) => {
        this.imageStorage.background = values[0];
        this.imageStorage.island = values[1];
        this.imageStorage.bridge_horizontal = values[2];
        this.imageStorage.bridge_vertical = values[3];
        this.imageStorage.bridge_horizontal_pattern = this.canvasBgContext.createPattern(
          this.imageStorage.bridge_horizontal,
          'repeat'
        );
        this.imageStorage.bridge_vertical_pattern = this.canvasBgContext.createPattern(
          this.imageStorage.bridge_vertical,
          'repeat'
        );

        this.canvasBgContext.drawImage(this.imageStorage.background, 0, 0);
        resolve();
      }).catch((error) => {
        console.log(error);
      });
    });
  }

  /**
   * @inheritDoc
   */
  drawIsland(island: Island, drawnConnections) {
    if (island.bridges == 0) {
      return;
    }

    const img = this.imageStorage.island;
    this.canvasBgContext.drawImage(img, island.xStart-img.width/5, island.yStart-img.height/5);

    // text
    this.canvasBgContext.fillStyle = 'white';
    this.canvasBgContext.fillText(
      island.bridges.toString(),
      island.xStart+img.width/4,
      island.yStart+img.height/2
    );

    this.drawConnections(island, BoardDirections.HORIZONTAL, drawnConnections);
    this.drawConnections(island, BoardDirections.VERTICAL, drawnConnections);
  }

  /**
   * @inheritDoc
   */
  protected adjustOtherAxisValue(otherAxisValue: number, i: number, connectionsNum: number) {
    if (connectionsNum != 2) {
      return otherAxisValue + this.config.islandSize/4;
    }
    if (i == 0) {
      return otherAxisValue- this.config.islandSize/11;
    }
    return otherAxisValue + this.config.islandSize*5/6;
  }
}
