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

      this.preloadImages([
        { name: 'background', url: 'assets/design/circuittalent/background.jpg' },
        { name: 'island', url: 'assets/design/circuittalent/chip.jpg' },
        { name: 'island_completed', url: 'assets/design/circuittalent/chip_completed.jpg' },
        { name: 'bridge_horizontal', url: 'assets/design/circuittalent/connection_horizontal.jpg' },
        { name: 'bridge_vertical', url: 'assets/design/circuittalent/connection.jpg' }
      ])
        .then(() => {
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
      })
        .catch((error) => console.error('Error preloading the images...'));
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
    this.canvasBgContext.drawImage(
      img,
      island.pxCoordsStart.x - img.width / 5,
      island.pxCoordsStart.y - img.height / 5
    );

    // text
    this.canvasBgContext.fillStyle = 'white';
    this.canvasBgContext.fillText(
      island.bridges.toString(),
      island.pxCoordsStart.x + 3,
      island.pxCoordsStart.y + 7
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
