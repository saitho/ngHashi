import {Component, Input, AfterViewInit, ElementRef, ViewChild} from '@angular/core';
import {AbstractMap} from '../maps/AbstractMap';
import {ActivatedRoute, NavigationStart, Router} from '@angular/router';
import {GameLevelsService} from '../../shared/services/GameLevelsService';
import AbstractGameBoardComponent from '../AbstractGameBoardComponent';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent extends AbstractGameBoardComponent implements AfterViewInit {
  @Input()
  public map: AbstractMap = null;
  @ViewChild('canvasBg')
  protected canvasBg: ElementRef;
  @ViewChild('canvasDraw')
  protected canvas: ElementRef;

  public message = 'Have fun! :)';
  public islandSize = 30;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private modalService: NgbModal,
              private gameLevels: GameLevelsService) {
    super();

    // stop timer when navigation to an other route is started
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.map.stopTimer();
      }
    });
  }

  /**
   * Set map from ID or encoded JSON data
   */
  ngAfterViewInit() {
    this.route.params.subscribe((params) => {
      setTimeout(() => {
        if (isNaN(params.id)) {
          // treat as mapdata hash
          const mapData = JSON.parse(atob(params.id));
          this.map = new AbstractMap();
          this.map.importFromJSON(mapData);
        } else {
          // treat as id
          this.gameLevels.loadLevel(Number(params.id)).subscribe((map) => {
            this.map = map;
            super.ngAfterViewInit();
          });
        }
      });
    });
  }

  /**
   * Reset the map
   * @return {Promise<void>}
   */
  public async restart() {
    if (confirm('Do you really want to restart the game?')) {
      this.map.reset();
      await this.drawGameBoard();
    }
  }

  /**
   * Shows the modal for data import
   * @param content
   */
  public help(content) {
    this.modalService.open(content).result.then((result) => {
      console.log(result);
    }, (reason) => {
      console.log(reason);
    });
  }

  /**
   * Open print dialogue for the current map
   */
  public print() {
    console.log('print', this.canvasBg, this.canvas);
    const dataUrl = this.canvasBg.nativeElement.toDataURL();
    // todo: try to include rules from game-help component...
    const windowContent = '<!DOCTYPE html><html>' +
      '<head><title>ngHashi - Puzzle: ' + this.map.title + '</title></head><body>' +
      '<h2>Game rules</h2>' +
      '<ul>\n' +
      '  <li>The number of bridges incident on an island matches that island\'s number</li>\n' +
      '  <li>Bridges can be set horizontally and vertically</li>\n' +
      '  <li>Each side of an island can take 2 bridges at its maximum</li>\n' +
      '  <li>Bridges must not cross other bridges or islands</li>\n' +
      '  <li>At the end all islands are connected</li>\n' +
      '</ul>' +
      '<img src="' + dataUrl + '">' +
      '</body></html>';
    const printWin = window.open('', '', 'width=800,height=800');
    printWin.document.open();
    printWin.document.write(windowContent);
    printWin.document.close();
    window.setTimeout(() => {
      printWin.focus();
      printWin.print();
      printWin.close();
    }, 1000);
  }

  /**
   * @inheritDoc
   */
  public drawGameBoard() {
    return new Promise<void>(resolve => {
      super.drawGameBoard()
        .then(() => {
          if (this.map.isSolved()) {
            this.message = 'Level solved.';
            this.map.stopTimer();
          } else if (this.drawnConnections.length) {
            // start timer if connections are drawn
            // -> user sets first connection
            // -> user returns to puzzle he already started
            this.map.startTimer();
          }
          resolve();
        })
        .catch(e => console.error(e));
    });
  }

  /**
   * @inheritDoc
   */
  public onTouchDown(e) {
    if (e.offsetX === undefined || e.offsetY === undefined) {
      return;
    }
    const hasIsland = this.gui.hasIsland(e.offsetX, e.offsetY);
    if (hasIsland) {
      this.startPosition.x = e.offsetX;
      this.startPosition.y = e.offsetY;
      this.started = true;
    } else {
      this.removeConnectionOnCursorPos(e);
    }
  }

  /**
   * @inheritDoc
   */
  public async onTouchUp(e) {
    if (e.offsetX === undefined || e.offsetY === undefined || !this.started) {
      return;
    }

    try {
      // pass start and stop ositions to GameEngine
      this.gui.putBridge(this.startPosition, this.stopPosition);
      this.message = 'Bridge set successfully.';
    } catch (e) {
      if (e.message) {
        this.message = e.message;
      } else {
        this.message = 'Invalid turn.';
      }
    }

    await this.drawGameBoard();
  }

  /**
   * @inheritDoc
   */
  public onTouchMove(e) {
    if (e.offsetX === undefined || e.offsetY === undefined || !this.started) {
      return;
    }
    this.canvasContext.clearRect(0, 0, this.gameWidth, this.gameHeight);
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
