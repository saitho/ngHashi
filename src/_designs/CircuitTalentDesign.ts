import {IDesignConfig} from './AbstractDesign';
import {Island} from '../app/Island';
import {BoardDirections} from '../shared/helper/GameEngine';
import {ElementRef} from '@angular/core';
import {AbstractGraphicalDesign} from './AbstractGraphicalDesign';

export class CircuitTalentDesign extends AbstractGraphicalDesign {
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
    this.canvasBg.width = 700;
    this.canvasBg.height = 300;
  }

  /**
   * @inheritDoc
   */
  public beforeDrawGameBoard(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.canvasContext.lineWidth = 5;
      this.canvasContext.strokeStyle = 'black';

      const background = this.preloadImage('assets/design/circuittalent/background.jpg');
      const island = this.preloadImage('assets/design/circuittalent/chip.jpg');
      const island_completed = this.preloadImage('assets/design/circuittalent/chip_completed.jpg');
      const bridge_horizontal = this.preloadImage('assets/design/circuittalent/connection_horizontal.jpg');
      const bridge_vertical = this.preloadImage('assets/design/circuittalent/connection.jpg');

      Promise.all([background, island, island_completed, bridge_horizontal, bridge_vertical])
        .then((values) => {
          this.imageStorage.background = values[0];
          this.imageStorage.island = values[1];
          this.imageStorage.island_completed = values[2];
          this.imageStorage.bridge_horizontal = values[3];
          this.imageStorage.bridge_vertical = values[4];
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
    if (island.bridges === 0) {
      return;
    }

    let img = this.imageStorage.island;
    if (island.isComplete()) {
      img = this.imageStorage.island_completed;
    }
    this.canvasBgContext.drawImage(img, island.xStart - img.width / 5, island.yStart - img.height / 5);

    // text
    this.canvasBgContext.fillStyle = 'white';
    this.canvasBgContext.fillText(
      island.bridges.toString(),
      island.xStart + 3,
      island.yStart + 7
    );

    this.drawConnections(island, BoardDirections.HORIZONTAL, drawnConnections);
    this.drawConnections(island, BoardDirections.VERTICAL, drawnConnections);
  }

  /**
   * @inheritDoc
   */
  protected adjustOtherAxisValue(otherAxisValue: number, i: number, connectionsNum: number) {
    return otherAxisValue - this.config.islandSize / 3 + 10 * (i + 1);
  }
}
