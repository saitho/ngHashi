import {InvalidTurnError} from "./Errors";
import {BoardDirections, GameEngine} from "./GameEngine";
import DefaultMap from "../maps/DefaultMap";
import {Island} from "../Island";
import {Connection} from "../Connection";
import {AbstractMap} from "../maps/AbstractMap";

export class GameGUI {
  private game: GameEngine;
  private map: AbstractMap;

  constructor(gameEngine: GameEngine) {
    this.game = gameEngine;
    this.map = new DefaultMap();
  }

  public getMap() {
    return this.map;
  }

  public removeBridge(connection: Connection) {
    this.game.disconnectIslands(connection.island, connection.connectedIsland, connection.direction);
  }

  public putBridge(x1, y1, x2, y2) {
    const direction = this.getLineDirection(x1, y1, x2, y2);
    const islands = this.getIslandInRange(x1, y1, x2, y2);
    if (islands.size !== 2 || direction === null) {
      throw new InvalidTurnError();
    }

    // connect islands on background canvas and clear drawing canvas
    const iter = islands.entries();
    const island1 = iter.next().value[0];
    const island2 = iter.next().value[0];
    this.game.connectIslands(island1, island2, direction);
  }

  public getTile(x, y, islandsOnly = true): Island {
    const map = this.map.getData();
    for(let i=0; i < map.length; i++) {
      for(let j=0; j < map[i].length; j++) {
        const island = map[i][j];
        if (island.bridges == 0 && islandsOnly) {
          continue;
        }
        if (
          (island.xStart <= x && island.xEnd > x) &&
          (island.yStart <= y && island.yEnd > y)
        ) {
          return island;
        }
      }
    }
    return null;
  }

  public hasIsland(x, y, islandsOnly = true): boolean {
    return !(this.getTile(x, y, islandsOnly) == null);
  }

  private getLineDirection(x1, y1, x2, y2) {
    if (x1 == x2) {
      return BoardDirections.VERTICAL;
    } else if (y1 == y2) {
      return BoardDirections.HORIZONTAL;
    }
    return null;
  }

  private getIslandInRange(x1, y1, x2, y2) {
    let islands = new Set();

    const direction = this.getLineDirection(x1, y1, x2, y2);
    switch (direction) {
      case BoardDirections.VERTICAL:
        if (y2 < y1) {
          const tmp = y2;
          y2 = y1;
          y1 = tmp;
        }
        for (let i = y1; i < y2; i++) {
          const island = this.getTile(x1, i);
          if (island == null) {
            continue;
          }
          islands.add(island);
        }
        break;
      case BoardDirections.HORIZONTAL:
        if (x2 < x1) {
          const tmp = x2;
          x2 = x1;
          x1 = tmp;
        }
        for (let i = x1; i < x2; i++) {
          const island = this.getTile(i, y1);
          if (island == null) {
            continue;
          }
          islands.add(island);
        }
        break;
      default:
        throw new Error('Undefined direction.');
    }
    return islands;
  }
}
