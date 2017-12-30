import {Component, AfterViewInit} from '@angular/core';
import EditorMap from "../maps/EditorMap";
import {GameGUI} from "../../shared/helper/GameGUI";
import AbstractGameBoardComponent from "../AbstractGameBoardComponent";
import {AbstractDesign} from "../../_designs/AbstractDesign";
import {BoardDirections} from "../../shared/helper/GameEngine";
import {UrlEncodePipe} from "../../shared/pipes/UrlEncodePipe";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent extends AbstractGameBoardComponent implements AfterViewInit {
  gui: GameGUI = new GameGUI();
  protected map = new EditorMap();
  public setBridges: boolean = false;

  constructor(
    private modalService: NgbModal
  ) {
    super();
    this.gameBoardConfig = {enableGrid: true, perRectMultiplier: 0.25, perRectOffset: 10};
  }

  islandSize = 50;

  gameWidth = 600;
  gameHeight = 600;

  valid = false;
  exportData = null;

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

    this.started = true;
  }

  /**
   * Disable "bridge setting" mode and pass the positions to the GameEngine
   * triggered when the the player stops drawing the bridge (mouseup)
   * Note: disabling "started" was moved to mouseClick as this is triggered after mouseDown...
   */
  async stopBridgeDrawing() {
    if (!this.setBridges || !this.started) {
      return;
    }

    try {
      // pass start and stop ositions to GameEngine
      this.gui.putBridge(this.startPosition.x, this.startPosition.y, this.stopPosition.x, this.stopPosition.y);
    } catch(e) {

    }
    await this.drawGameBoard();
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

  async mouseClick(e) {
    if (this.setBridges) {
      // in "set bridges" mode only remove connections...
      this.removeConnectionOnCursorPos(e);
      return;
    }

    // add/remove island
    let x = Math.floor(e.offsetX / (this.gameWidth/7));
    let y = Math.floor(e.offsetY / (this.gameHeight/7));
    const island = this.map.getData()[y][x];

    if (island.bridges) {
      // if bridges are set: remove island
      if (island.countConnections() > 0) {
        ['left', 'right', 'top', 'bottom'].forEach(direction => {
          island.connections[direction].forEach(
            (island2) => {
              this.drawnConnections.filter((connection) => {
                return (
                  (connection.island === island && connection.connectedIsland === island2) ||
                  (connection.island === island2 && connection.connectedIsland === island)
                );
              }).forEach((connection) => {
                this.gui.removeBridge(connection);
              });
            }
          );
        });
      }

      island.bridges = 0;
    } else {
      // if no bridges are set: set one "imaginary" bridge to make it show on the editor

      if (this.hasConnectionOnTile(x, y)) {
        // do not set bridge if a tile is used by a connection
        return;
      }

      island.bridges = 1;
    }
    await this.drawGameBoard();
  }

  private hasConnectionOnTile(x: number, y: number): boolean {
    const relevantConnections = this.drawnConnections.filter((connection) => {
      // remove connections where the axis that is perpendicular to the axis
      // of the  connection itself does not match the requirements
      return !((connection.direction === BoardDirections.VERTICAL && connection.otherAxis != x) ||
        (connection.direction === BoardDirections.HORIZONTAL && connection.otherAxis != y));
    });

    if (!relevantConnections.length) {
      // no relevant connections found: no obstruction
      return false;
    }

    for (let connection of relevantConnections) {
      let start = connection.start;
      let end = connection.end;

      let connectionAxis = new Set();
      for (let i = ++start; i < end; i++) {
        connectionAxis.add(i);
      }

      if (connection.direction === BoardDirections.VERTICAL && connectionAxis.has(y)) {
        return true;
      } else if (connection.direction === BoardDirections.HORIZONTAL && connectionAxis.has(x)) {
        return true;
      }
    }
    return false;
  }

  /**
   * draws the game board
   */
  drawGameBoard() {
    return new Promise<void>(resolve => {
      super.drawGameBoard()
        .then(() => {
          this.valid = this.gui.getMap().isConnectedGraph();
          resolve();
        })
        .catch(e => console.error(e));
    });
  }

  submitGitHub() {
    if (!this.save()) {
      return;
    }
    const urlEncode = new UrlEncodePipe();
    window.open(
      'https://github.com/saitho/hashi/issues/new?title=[Level]%20' + urlEncode.transform(this.exportData.title) +
      '&body=```' + urlEncode.transform(this.exportData.json) +'```Path: ' + urlEncode.transform(this.exportData.path),
      '_blank'
    );
  }

  playMap() {
    if (!this.save()) {
      return;
    }
    window.open(this.exportData.path, '_blank');
  }

  importModal(content) {
    this.modalService.open(content).result.then((result) => {
      console.log(result);
    }, (reason) => {
      console.log(reason);
    });
  }

  async import(data) {
    try {
      let json = JSON.parse(data);

      if (
        !json.hasOwnProperty('map') ||
        !json.map.hasOwnProperty('title') ||
        !json.map.hasOwnProperty('themeName') ||
        !json.map.hasOwnProperty('data')
      ) {
        alert('Malformed JSON file.');
        return;
      }

      if (!confirm('Are you sure you want to overwrite your current settings? This can not be undone!')) {
        return;
      }
      this.map.importFromJSON(json);
      await this.drawGameBoard();
    } catch(e) {
      alert('Invalid JSON.');
    }
  }

  export() {
    if (!this.save()) {
      return;
    }

    const data = "data:text/json;charset=utf-8," + encodeURIComponent(this.exportData.jsonEditor);
    const downloader = document.createElement('a');

    downloader.setAttribute('href', data);
    downloader.setAttribute('download', 'hashi_export.json');
    downloader.click();
  }

  save() {
    if (!this.map.title || this.map.title == "") {
      alert('Please enter a map title.');
      return false;
    }
    const json = this.map.exportObject();
    const path = '/play/' + btoa(json);

    this.exportData = {
      title: this.map.title,
      json: json,
      jsonEditor: this.map.exportEditorObject(),
      path: path
    };
    return true;
  }
}
