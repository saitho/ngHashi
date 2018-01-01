import {IDesignConfig} from './AbstractDesign';
import {Coords, Island} from '../app/Island';
import {BoardDirections} from '../shared/helper/GameEngine';
import {ElementRef} from '@angular/core';
import {AbstractGraphicalDesign} from './AbstractGraphicalDesign';

export class SushiDesign extends AbstractGraphicalDesign {
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
  public beforeDrawGameBoard(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.canvasContext.lineWidth = 3;

      this.preloadImages([
        { name: 'island', url: 'assets/design/sushi/sushi.png' },
        { name: 'bridge_horizontal', url: 'assets/design/sushi/chopsticks_horizontal.png' },
        { name: 'bridge_vertical', url: 'assets/design/sushi/chopsticks.png' },
      ])
        .then(() => resolve())
        .catch((error) => console.error('Error while preloading the images-'));
    });
  }

  /**
   * @inheritDoc
   */
  drawIsland(island: Island, drawnConnections) {
    if (island.bridges === 0) {
      return;
    }

    const img = this.imageStorage.island;
    this.canvasBgContext.drawImage(
      img,
      island.pxCoordsStart.x - img.width / 5,
      island.pxCoordsStart.y - img.height / 5
    );

    // text
    this.canvasBgContext.fillStyle = 'white';
    this.canvasBgContext.fillText(
      island.bridges.toString(),
      island.pxCoordsStart.x + img.width / 4,
      island.pxCoordsStart.y + img.height / 2
    );

    this.drawConnections(island, BoardDirections.HORIZONTAL, drawnConnections);
    this.drawConnections(island, BoardDirections.VERTICAL, drawnConnections);
  }

  /**
   * @inheritDoc
   */
  protected adjustOtherAxisValue(otherAxisValue: number, i: number, connectionsNum: number) {
    let otherAxis = otherAxisValue + this.config.islandSize / 2;
    if (connectionsNum === 2) {
      otherAxis = otherAxisValue + this.config.islandSize * (i + 1) / 3;
    }
    return otherAxis;
  }

  /**
   * @inheritDoc
   */
  protected drawConnectionLine(moveTo: Coords, lineTo: Coords, direction: BoardDirections) {
    let image = this.imageStorage.bridge_horizontal;
    if (direction === BoardDirections.VERTICAL) {
      image = this.imageStorage.bridge_vertical;
    }

    let x = lineTo.x;
    let y = lineTo.y;
    let imgW = image.width;
    let imgH = Math.abs(moveTo.y - lineTo.y);
    if (direction === BoardDirections.HORIZONTAL) {
      imgW = Math.abs(moveTo.x - lineTo.x);
      imgH = image.height;
      x = moveTo.x;
      y = moveTo.y;
    }

    this.canvasBgContext.beginPath();
    this.canvasBgContext.drawImage(image, x, y, imgW, imgH);
    this.canvasBgContext.closePath();
  }
}
