import {AbstractDesign, IDesignConfig} from "../app/game/Designs/AbstractDesign";
import {Island} from "../app/Island";
import {BoardDirections} from "../shared/helper/GameEngine";
import {Connection} from "../app/Connection";
import {ElementRef} from "@angular/core";

export class CircuitTalentDesign extends AbstractDesign {
  constructor(canvas: ElementRef, canvasBg: ElementRef, config: IDesignConfig) {
    super(canvas, canvasBg, config);

    // set font for background canvas
    this.canvasBgContext.font = '16px sans-serif';
    this.canvasBgContext.textBaseline = 'middle';
    this.canvasBgContext.textAlign = 'center';
  }


  public init() {
    this.canvasBg.width = 700;
    this.canvasBg.height = 300;
  }

  public beforeDrawGameBoard(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.canvasContext.lineWidth = 5;
      this.canvasContext.strokeStyle = 'black';

      const background = this.preloadImage('assets/design/circuittalent/background.jpg');
      const island = this.preloadImage('assets/design/circuittalent/chip.jpg');
      const bridge_horizontal = this.preloadImage('assets/design/circuittalent/connection_horizontal.jpg');
      const bridge_vertical = this.preloadImage('assets/design/circuittalent/connection.jpg');

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
   * draws an island onto the background canvas
   * @param {Island} island
   * @param {Connection[]} drawnConnections
   */
  drawIsland(island: Island, drawnConnections) {
    if (island.bridges == 0) {
      return;
    }

    const img = this.imageStorage.island;
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
   * draws connections of an island on background canvas
   * @param island
   * @param direction
   * @param drawnConnections
   */
  drawConnections(island: Island, direction: BoardDirections, drawnConnections: Connection[]) {
    let islandOtherAxisVar, valueName;
    if (direction == BoardDirections.HORIZONTAL) {
      // draw right connections on vertical horizontal
      valueName = 'right';
      islandOtherAxisVar = 'yStart';
    } else if (direction == BoardDirections.VERTICAL) {
      // draw top connections on vertical direction
      valueName = 'top';
      islandOtherAxisVar = 'xStart';
    } else {
      throw new Error('Unknown direction.');
    }

    let connections = island.connections[valueName];
    for (let i = 0; i < connections.length; i++) {

      let otherAxis = island[islandOtherAxisVar] - this.config.islandSize / 3 + 10 * (i+1);

      const connection = this.generateConnection(island, connections[i], direction, otherAxis);
      drawnConnections.push(connection);
      this.canvasBgContext.beginPath();
      let image = this.imageStorage.bridge_horizontal;
      let pattern = this.imageStorage.bridge_horizontal_pattern;
      if (connection.direction == BoardDirections.VERTICAL) {
        pattern = this.imageStorage.bridge_vertical_pattern;
        image = this.imageStorage.bridge_vertical;
      }

      const length = Math.abs(connection.startPx - connection.endPx);
      let pattern_repeat = 'repeat';
      if (connection.direction == BoardDirections.HORIZONTAL) {
        this.canvasBgContext.rect(connection.startPx, connection.otherAxisPx, length, image.height);
      } else {
        pattern_repeat = 'repeat';
        this.canvasBgContext.rect(connection.otherAxisPx, connection.endPx, image.width, length);
      }
      this.canvasBgContext.fillStyle = pattern;
      this.canvasBgContext.fill();

      this.canvasBgContext.closePath();
    }
  }
}
