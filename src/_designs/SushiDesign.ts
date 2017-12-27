import {AbstractDesign, IDesignConfig} from "../app/game/Designs/AbstractDesign";
import {Island} from "../app/Island";
import {BoardDirections} from "../shared/helper/GameEngine";
import {Connection} from "../app/Connection";
import {ElementRef} from "@angular/core";

export class SushiDesign extends AbstractDesign {
  constructor(canvas: ElementRef, canvasBg: ElementRef, config: IDesignConfig) {
    super(canvas, canvasBg, config);

    // set font for background canvas
    this.canvasBgContext.font = '16px sans-serif';
    this.canvasBgContext.textBaseline = 'middle';
    this.canvasBgContext.textAlign = 'center';
  }
  public beforeDrawGameBoard(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.canvasContext.lineWidth = 3;

      const island = this.preloadImage('assets/design/sushi/sushi.png');
      const bridge_horizontal = this.preloadImage('assets/design/sushi/chopsticks_horizontal.png');
      const bridge_vertical = this.preloadImage('assets/design/sushi/chopsticks.png');

      Promise.all([island, bridge_horizontal, bridge_vertical])
        .then((values) => {
        this.imageStorage.island = values[0];
        this.imageStorage.bridge_horizontal = values[1];
        this.imageStorage.bridge_vertical = values[2];
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

      let otherAxis = island[islandOtherAxisVar] + this.config.islandSize/2;
      if (connections.length == 2) {
        otherAxis = island[islandOtherAxisVar] + this.config.islandSize*(i+1)/3;
      }
      const connection = this.generateConnection(island, connections[i], direction, otherAxis);
      drawnConnections.push(connection);
      this.canvasBgContext.beginPath();

      const length = Math.abs(connection.startPx-connection.endPx);
      if (connection.direction == BoardDirections.HORIZONTAL) {
        const img = this.imageStorage.bridge_horizontal;
        this.canvasBgContext.drawImage(img, connection.startPx, connection.otherAxisPx, length, img.height);
      }else{
        const img = this.imageStorage.bridge_vertical;
        this.canvasBgContext.drawImage(img, connection.otherAxisPx, connection.endPx, img.width, length);
      }
      this.canvasBgContext.closePath();
    }
  }
}
