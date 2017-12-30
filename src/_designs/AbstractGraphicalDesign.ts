import {AbstractDesign} from "./AbstractDesign";
import {BoardDirections} from "../shared/helper/GameEngine";
import {Coords} from "../app/Island";
/**
 * Structure of the ImageStorage object
 */
interface IImageStorage {
  background: HTMLImageElement,
  island: HTMLImageElement,
  island_completed: HTMLImageElement,
  bridge_horizontal: HTMLImageElement,
  bridge_vertical: HTMLImageElement,
  bridge_horizontal_pattern: CanvasPattern,
  bridge_vertical_pattern: CanvasPattern
}

export abstract class AbstractGraphicalDesign extends AbstractDesign {
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
   * @inheritDoc
   */
  protected drawConnectionLine(moveTo: Coords, lineTo: Coords, direction: BoardDirections) {
    let image = this.imageStorage.bridge_horizontal;
    let pattern = this.imageStorage.bridge_horizontal_pattern;
    if (direction == BoardDirections.VERTICAL) {
      pattern = this.imageStorage.bridge_vertical_pattern;
      image = this.imageStorage.bridge_vertical;
    }

    let x = lineTo.x;
    let y = lineTo.y;
    let patternW = image.width;
    let patternH = Math.abs(moveTo.y - lineTo.y);
    if (direction == BoardDirections.HORIZONTAL) {
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
