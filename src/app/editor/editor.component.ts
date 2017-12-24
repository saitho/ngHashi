import {Component, AfterViewInit} from '@angular/core';
import BlankMap from "../maps/BlankMap";
import {GameGUI} from "../../shared/helper/GameGUI";
import AbstractGameBoardComponent from "../AbstractGameBoardComponent";
import {AbstractDesign} from "../game/Designs/AbstractDesign";

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent extends AbstractGameBoardComponent implements AfterViewInit {
  gui: GameGUI = new GameGUI();
  protected map = new BlankMap();
  protected setBridges: boolean = false;

  islandSize = 50;
  gameWidth = 600;
  gameHeight = 600;

  valid = false;

  protected initGame(design: AbstractDesign) {
    design.enableEditorMode();
    super.initGame(design);
  }

  setTool(tool: string) {
    this.setBridges = (tool === 'bridges');
  }

  /**
   * Save current position and enable "bridge setting" mode
   * triggered when the the player starts drawing the bridge (mousedown)
   */
  startBridgeDrawing(e) {
    if (!this.setBridges) {
      return;
    }
    this.startPosition.x = e.offsetX;
    this.startPosition.y = e.offsetY;

    const x = Math.floor(e.offsetX/60);
    const y = Math.floor(e.offsetY/60);

    this.started = true;
  }

  /**
   * Disable "bridge setting" mode and pass the positions to the GameEngine
   * triggered when the the player stops drawing the bridge (mouseup)
   * Note: disabling "started" was moved to mouseClick as this is triggered after mouseDown...
   */
  stopBridgeDrawing() {
    if (!this.setBridges || !this.started) {
      return;
    }

    try {
      // pass start and stop ositions to GameEngine
      this.gui.putBridge(this.startPosition.x, this.startPosition.y, this.stopPosition.x, this.stopPosition.y);
    } catch(e) {

    }
    this.drawGameBoard();
  }

  /**
   * triggered while the bridge is being drawn by the player (mousemove)
   * @param e
   */
  duringBridgeDrawing(e) {
    if (!this.setBridges || !this.started) {
      return;
    }
    this.canvasContext.clearRect(0,0, 448, 448);
    this.canvasContext.beginPath();
    this.canvasContext.moveTo(this.startPosition.x, this.startPosition.y);
    const dx = e.offsetX - this.startPosition.x;
    const dy = e.offsetY - this.startPosition.y;
    if (Math.abs(dx) > Math.abs(dy)) {
      this.canvasContext.lineTo(e.offsetX, this.startPosition.y);
      this.stopPosition.x = e.offsetX;
      this.stopPosition.y = this.startPosition.y;
    } else {
      this.canvasContext.lineTo(this.startPosition.x, e.offsetY);
      this.stopPosition.x = this.startPosition.x;
      this.stopPosition.y = e.offsetY;
    }
    this.canvasContext.stroke();
    this.canvasContext.closePath();
  }

  mouseClick(e) {
    if (this.setBridges) {
      // Remove bridges...
      if (this.started) {
        this.started = false;
        return;
      }
      // Check for a connection that goes through the tile
      const connections = this.getConnectionsFromCursorPos(e);
      if (connections.length == 0) {
        return;
      }
      // drop one connection
      this.gui.removeBridge(connections[0]);
    } else {
      let x = Math.floor(e.offsetX / (600/7));
      let y = Math.floor(e.offsetY / (600/7));
      const island = this.map.getData()[y][x];

      if (island.bridges) {
        // remove island

        if (island.countConnections() > 0) {
          const connectedIslandList = [];
          ['left', 'right', 'top', 'bottom'].forEach(direction => {
            this.map.getData()[y][x].connections[direction].forEach(
              (island2) => connectedIslandList.push(island2)
            );
          });
          connectedIslandList.forEach((island2) => {
            this.drawnConnections.forEach(connection => {
              if (
                (connection.island === island && connection.connectedIsland === island2) ||
                (connection.connectedIsland === island && connection.island === island2)
              ) {
                this.gui.removeBridge(connection);
              }
            });
          });
        }

        this.map.getData()[y][x].bridges = 0;
      } else {
        this.map.getData()[y][x].bridges = 1;
      }
    }
    this.drawGameBoard();
  }

  protected drawGrid() {
    this.canvasBgContext.lineWidth = 2;
    this.canvasBgContext.beginPath();

    // top border
    this.canvasBgContext.moveTo(0, 1);
    this.canvasBgContext.lineTo(this.gameWidth, 1);
    this.canvasBgContext.stroke();

    // bottom border
    this.canvasBgContext.moveTo(0, this.gameHeight - 2);
    this.canvasBgContext.lineTo(this.gameWidth, this.gameHeight - 2);
    this.canvasBgContext.stroke();

    // left border
    this.canvasBgContext.moveTo(1, 0);
    this.canvasBgContext.lineTo(1, this.gameHeight);
    this.canvasBgContext.stroke();

    // right border
    this.canvasBgContext.moveTo(this.gameWidth - 2, 0);
    this.canvasBgContext.lineTo(this.gameWidth - 2, this.gameHeight);
    this.canvasBgContext.stroke();

    for (let i = 0; i < this.map.getData().length; i++) {
      // vertical lines
      this.canvasBgContext.moveTo(this.gameWidth * (i+1) / this.map.getData().length, 0);
      this.canvasBgContext.lineTo(this.gameWidth * (i+1) / this.map.getData().length, this.gameHeight);
      this.canvasBgContext.stroke();

      // horizontal lines
      this.canvasBgContext.moveTo(0, this.gameHeight * (i+1) / this.map.getData().length);
      this.canvasBgContext.lineTo(this.gameWidth, this.gameHeight * (i+1) / this.map.getData().length);
      this.canvasBgContext.stroke();
    }

    this.canvasBgContext.closePath();
  }

  private isEditorMapValid(): boolean {
    const map = this.gui.getMap().getData();
    let totalConnections = 0;
    for(let i=0; i < map.length; i++) {
      for (let j = 0; j < map[i].length; j++) {
        if (!map[i][j].bridges) {
          continue;
        }
        if (!map[i][j].countConnections()) {
          return false;
        }
        totalConnections += map[i][j].countConnections();
      }
    }
    return totalConnections > 0;
  }

  /**
   * draws the game board
   */
  drawGameBoard() {
    this.started = false;
    this.valid = this.isEditorMapValid();
    const map = this.gui.getMap().getData();

    // clear drawing canvas
    this.canvasContext.clearRect(0,0, this.gameWidth, this.gameHeight);
    // clear background canvas
    this.canvasBgContext.clearRect(0,0, this.gameWidth, this.gameHeight);
    this.drawGrid();

    this.design.beforeDrawGameBoard()
      .then(() => {
        // distribute game window size amongst all map tiles and keep some space around (length+1)
        const xPerRect = this.gameWidth/(map.length+1);
        const yPerRect = this.gameHeight/(map.length+1);

        // clear connections
        this.drawnConnections = [];

        // Draw islands
        for(let i=0; i < map.length; i++) {
          for(let j=0; j < map[i].length; j++) {
            const island = map[j][i]; // switch j and i to keep the order from array in rendering
            if (island.init == false) {
              island.xStart = xPerRect/4 + i*(xPerRect+10);
              island.yStart = yPerRect/4 + j*(yPerRect+10);
              island.xEnd = island.xStart + this.islandSize;
              island.yEnd = island.yStart + this.islandSize;
              island.init = true;
            }
            this.design.drawIsland(island, this.drawnConnections);
          }
        }
      })
      .catch((error) => {
        console.log('Error in beforeDrawGameBoard hook', error);
      });
  }

  save() {
    console.log('save');

    const title = prompt("Map title?");

    if (title == null || title == "") {
      alert('Missing title, saving aborted.');
      return;
    }
    this.map.title = title;
    console.log(this.map.exportJSON());
  }
}
