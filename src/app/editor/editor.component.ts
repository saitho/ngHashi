import {Component, AfterViewInit, ElementRef, ViewChild, OnInit} from '@angular/core';
import BlankMap from "../maps/BlankMap";
import {GameGUI} from "../../shared/helper/GameGUI";

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit, AfterViewInit {
  gui: GameGUI = new GameGUI();
  protected map = new BlankMap();
  protected setBridges: boolean = false;

  ngAfterViewInit() {
    setTimeout(() => {
      this.gui.setMap(this.map);
    });
  }

  clickColumn(x, y) {
    if (this.setBridges) {
      return;
    }
    this.map.data[x][y].bridges = !this.map.data[x][y].bridges ? 1 : 0;
  }

  setTool(tool: string) {
    this.setBridges = (tool === 'bridges');
  }

  ngOnInit() {
    this.canvasContext = this.canvas.nativeElement.getContext('2d');
  }


  started = false;
  startPosition = {x: -300, y: -300};
  stopPosition = {x: -300, y: -300};

  @ViewChild('canvasDraw') canvas: ElementRef;
  canvasContext: CanvasRenderingContext2D;

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

    console.log(x, y);
    this.started = this.map.data[x][y].bridges > 0;
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
    console.log('stopBridgeDrawing');

    // todo: put bridge
    // this.gui.putBridge(this.startPosition.x, this.startPosition.y, this.stopPosition.x, this.stopPosition.y);
    console.log(this.startPosition.x, this.startPosition.y, this.stopPosition.x, this.stopPosition.y);
  }

  /**
   * triggered while the bridge is being drawn by the player (mousemove)
   * @param e
   */
  duringBridgeDrawing(e) {
    if (!this.setBridges || !this.started) {
      return;
    }
    console.log('during');
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
}
