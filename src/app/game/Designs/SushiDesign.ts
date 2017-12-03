import {AbstractDesign, IDesignConfig} from "./AbstractDesign";
import {Island} from "../../Island";
import {BoardDirections} from "../GameEngine";
import {Connection} from "../../Connection";
import {ElementRef} from "@angular/core";

export class SushiDesign extends AbstractDesign {
  constructor(canvas: ElementRef, config: IDesignConfig) {
    super(canvas, config);

    // set font for background canvas
    this.canvasBgContext.font = '16px sans-serif';
    this.canvasBgContext.textBaseline = 'middle';
    this.canvasBgContext.textAlign = 'center';
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

    const img = new Image(50, 50);
    img.addEventListener('load', () => {
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
    }, false);
    img.src = 'assets/design/sushi/sushi.png';
  }

  /**
   * draws connections of an island on background canvas
   * @param island
   * @param direction
   * @param drawnConnections
   */
  drawConnections(island: Island, direction: BoardDirections, drawnConnections: Connection[]) {
    let islandStartVar, islandOtherAxisVar, connectedIslandEndName, valueName;
    if (direction == BoardDirections.HORIZONTAL) {
      // draw right connections on vertical horizontal
      valueName = 'right';
      islandStartVar = 'xEnd';
      islandOtherAxisVar = 'yStart';
      connectedIslandEndName = 'xStart';
    } else if (direction == BoardDirections.VERTICAL) {
      // draw top connections on vertical direction
      valueName = 'top';
      islandStartVar = 'yStart';
      islandOtherAxisVar = 'xStart';
      connectedIslandEndName = 'yEnd';
    } else {
      throw new Error('Unknown direction.');
    }

    let connections = island.connections[valueName];
    for (let i = 0; i < connections.length; i++) {

      let otherAxis = island[islandOtherAxisVar] + this.config.islandSize/2;
      if (connections.length == 2) {
        otherAxis = island[islandOtherAxisVar] + this.config.islandSize*(i+1)/3;
      }

      let connectedIsland = connections[i];
      let connection = {
        direction: direction,
        otherAxis: otherAxis,
        start: island[islandStartVar],
        end: connectedIsland[connectedIslandEndName],
        island: island,
        connectedIsland: connectedIsland
      };

      drawnConnections.push(connection);
      this.canvasBgContext.beginPath();
      const length = Math.abs(connection.start-connection.end);
      if (connection.direction == BoardDirections.HORIZONTAL) {
        const img = new Image();
        img.addEventListener('load', () => {
          this.canvasBgContext.drawImage(img, connection.start, connection.otherAxis, length, img.height);
        }, false);
        img.src = 'assets/design/sushi/chopsticks_horizontal.png';
      } else if (connection.direction == BoardDirections.VERTICAL) {
        const img = new Image();
         img.addEventListener('load', () => {
           this.canvasBgContext.drawImage(img, connection.otherAxis, connection.end, img.width, length);
         }, false);
         img.src = 'assets/design/sushi/chopsticks.png';
      }
      this.canvasBgContext.closePath();
    }
  }
}
