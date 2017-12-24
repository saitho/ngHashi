import {GameGUI} from "../shared/helper/GameGUI";
import {AbstractMap} from "./maps/AbstractMap";
import {AfterViewInit, ElementRef, OnInit, ViewChild} from "@angular/core";
import {AbstractDesign} from "./game/Designs/AbstractDesign";
import {Connection} from "./Connection";
import {GameThemes} from "../shared/helper/GameThemes";

export default abstract class AbstractGameBoardComponent implements OnInit, AfterViewInit {
  protected map: AbstractMap = null;
  @ViewChild('canvasBg') canvasBg: ElementRef;
  @ViewChild('canvasDraw') canvas: ElementRef;
  gameWidth_default = 600;
  gameHeight_default = 600;
  abstract islandSize;
  gameWidth;
  gameHeight;
  canvasContext: CanvasRenderingContext2D;
  canvasBgContext: CanvasRenderingContext2D;
  protected design: AbstractDesign;
  protected started = false;
  protected startPosition = {x: -300, y: -300};
  protected stopPosition = {x: -300, y: -300};

  /**
   * saves drawn connections to be able to remove them later
   * @type {Array}
   */
  protected drawnConnections: Connection[] = [];

  gui: GameGUI = new GameGUI();


  ngAfterViewInit() {
    let defaultTheme = GameThemes.getTheme(this.map.themeName, {
      canvas: this.canvas,
      canvasBg: this.canvasBg,
      config: {
        islandBorderSize: 2,
        islandSize: this.islandSize
      }
    });

    this.initGame(defaultTheme);
  }


  protected initGame(design: AbstractDesign) {
    this.design = design;
    this.gui.setMap(this.map);
    // reset canvas sizes
    this.canvasBg.nativeElement.width = 0;
    this.canvasBg.nativeElement.height = 0;

    // save canvas contexts
    this.canvasBgContext = this.canvasBg.nativeElement.getContext('2d');
    this.canvasContext = this.canvas.nativeElement.getContext('2d');

    this.design.init();

    // Set default value if no value has been set by design
    if (this.canvasBg.nativeElement.width == 0) {
      this.canvasBg.nativeElement.width = this.gameWidth_default;
    }
    if (this.canvasBg.nativeElement.height == 0) {
      this.canvasBg.nativeElement.height = this.gameHeight_default;
    }

    // if size has change adjust dimensions
    if (
      (this.canvasBg.nativeElement.width != this.gameWidth) ||
      (this.canvasBg.nativeElement.height != this.gameHeight)
    ) {
      this.gameWidth = this.canvasBg.nativeElement.width;
      this.gameHeight = this.canvasBg.nativeElement.height;

      // trigger recalculation of island positions
      const map = this.gui.getMap().getData();
      for(let i=0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
          map[i][j].init = false;
        }
      }
    }
    this.canvas.nativeElement.width = this.canvasBg.nativeElement.width;
    this.canvas.nativeElement.height = this.canvasBg.nativeElement.height;

    // draw
    this.drawGameBoard();
  }

  public abstract mouseClick(e);
  public abstract startBridgeDrawing(e);
  public abstract stopBridgeDrawing(e);
  public abstract duringBridgeDrawing(e);
  public abstract drawGameBoard();

  ngOnInit() {
    this.canvasBgContext = this.canvasBg.nativeElement.getContext('2d');
    this.canvasContext = this.canvas.nativeElement.getContext('2d');
  }
}
