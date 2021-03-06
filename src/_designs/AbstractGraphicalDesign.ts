import {AbstractDesign} from './AbstractDesign';
import {BoardDirections} from '../shared/helper/GameEngine';
import {Coords} from '../app/Island';
/**
 * Structure of the ImageStorage object
 */
interface IImageStorage {
  background: HTMLImageElement;
  island: HTMLImageElement;
  island_completed: HTMLImageElement;
  bridge_horizontal: HTMLImageElement;
  bridge_vertical: HTMLImageElement;
  bridge_horizontal_pattern: CanvasPattern;
  bridge_vertical_pattern: CanvasPattern;
}

export abstract class AbstractGraphicalDesign extends AbstractDesign {
  /**
   * Stores preloaded graphics
   * @type {IImageStorage}
   */
  protected imageStorage: IImageStorage = {
    background: null,
    island: null,
    island_completed: null,
    bridge_horizontal: null,
    bridge_vertical: null,
    bridge_horizontal_pattern: null,
    bridge_vertical_pattern: null
  };

  /**
   * Preloads images from the urls in config into the local imageStorage variable
   * @param {{name: string; url: string}[]} config
   * @return {Promise<void>}
   */
  protected preloadImages(config: {name: string; url: string}[]) {
    return new Promise<void>(resolve => {
      const allPromises: Promise<any>[] = [];
      config.forEach(value => {
        allPromises.push(this.preloadImage(value.url));
      });

      Promise.all(allPromises)
        .then((returnValues) => {
          let i = 0;
          config.forEach(value => {
            this.imageStorage[value.name] = returnValues[i];
            i++;
          });
          resolve();
        }).catch((error) => {
        console.log(error);
      });
    });
  }

  /**
   * Draws a graphical connection from patterns on the background canvas
   * @param {Coords} moveTo
   * @param {Coords} lineTo
   * @param {BoardDirections} direction
   */
  protected drawConnectionLine(moveTo: Coords, lineTo: Coords, direction: BoardDirections) {
    let image = this.imageStorage.bridge_horizontal;
    let pattern = this.imageStorage.bridge_horizontal_pattern;
    if (direction === BoardDirections.VERTICAL) {
      pattern = this.imageStorage.bridge_vertical_pattern;
      image = this.imageStorage.bridge_vertical;
    }

    let x = lineTo.x;
    let y = lineTo.y;
    let patternW = image.width;
    let patternH = Math.abs(moveTo.y - lineTo.y);
    if (direction === BoardDirections.HORIZONTAL) {
      patternW = Math.abs(moveTo.x - lineTo.x);
      patternH = image.height;
      x = moveTo.x;
      y = moveTo.y;
    }

    this.canvasBgContext.beginPath();
    this.canvasBgContext.rect(x, y, patternW, patternH);
    this.canvasBgContext.fillStyle = pattern;
    this.canvasBgContext.fill();
    this.canvasBgContext.closePath();
  }
}
