import {AbstractDesign, IDesignConfig} from "./AbstractDesign";
import {Island} from "../../Island";
import {BoardDirections} from "../../../shared/helper/GameEngine";
import {Connection} from "../../Connection";
import {ElementRef} from "@angular/core";

export class ClassicDesign extends AbstractDesign {
  constructor(canvas: ElementRef, canvasBg: ElementRef, config: IDesignConfig) {
    super(canvas, canvasBg, config);
  }

  public init() {
  }

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
   * draws an island onto the background canvas
   * @param {Island} island
   * @param {Connection[]} drawnConnections
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
      if (connection.direction == BoardDirections.HORIZONTAL) {
        this.canvasBgContext.moveTo(connection.startPx, connection.otherAxisPx);
        this.canvasBgContext.lineTo(connection.endPx, connection.otherAxisPx);
      } else if (connection.direction == BoardDirections.VERTICAL) {
        this.canvasBgContext.moveTo(connection.otherAxisPx, connection.startPx);
        this.canvasBgContext.lineTo(connection.otherAxisPx, connection.endPx);
      }
      this.canvasBgContext.stroke();
      this.canvasBgContext.closePath();
    }
  }
}
