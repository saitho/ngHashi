import {InvalidTurnError} from "../../app/game/Errors";
import {BoardDirections, GameEngine} from "./GameEngine";
import {Coords, Island} from "../../app/Island";
import {Connection} from "../../app/Connection";
import {AbstractMap} from "../../app/maps/AbstractMap";
import EditorMap from "../../app/maps/EditorMap";

/**
 * Deals with position (pixels...) related tasks
 */
export class GameGUI {
  private map: AbstractMap = null;

  constructor() {
  }

  /**
   * Sets the Map object
   * @param {AbstractMap} map
   */
  public setMap(map: AbstractMap) {
    this.map = map;
  }

  /**
   * Gets the assigned Map object
   * @return {AbstractMap}
   */
  public getMap() {
    return this.map;
  }

  /**
   * Removes a bridge
   * @param {Connection} connection
   */
  public removeBridge(connection: Connection) {
    GameEngine.disconnectIslands(connection.island, connection.connectedIsland, connection.direction, (this.map instanceof EditorMap));
  }

  /**
   * Sets a bridge at screen coords
   * @param {Coords} start
   * @param {Coords} stop
   */
  public putBridge(start: Coords, stop: Coords) {
    const direction = this.getLineDirection(start, stop);
    const islands = this.getIslandInRange(start, stop);
    if (
      (islands.size !== 2 || direction === null) &&
      !(this.map instanceof EditorMap)
    ) {
      throw new InvalidTurnError();
    }

    // connect islands on background canvas and clear drawing canvas
    const iter = islands.entries();
    const island1 = iter.next().value[0];
    const island2 = iter.next().value[0];
    GameEngine.connectIslands(island1, island2, direction, (this.map instanceof EditorMap));
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

  private getLineDirection(start: Coords, stop: Coords) {
    if (start.x == stop.x) {
      return BoardDirections.VERTICAL;
    } else if (start.y == stop.y) {
      return BoardDirections.HORIZONTAL;
    }
    return null;
  }

  /**
   * Returns islands within an area
   * Used to check if connection goes to the nearest isl
   * @param {Coords} start
   * @param {Coords} stop
   * @return {Set<Island>}
   */
  private getIslandInRange(start: Coords, stop: Coords): Set<Island> {
    let axis, otherAxis;

    const direction = this.getLineDirection(start, stop);
    switch (direction) {
      case BoardDirections.VERTICAL:
        axis = 'y';
        otherAxis = 'x';
        break;
      case BoardDirections.HORIZONTAL:
        axis = 'x';
        otherAxis = 'y';
        break;
      default:
        throw new Error('Undefined direction.');
    }

    if (stop[axis] < start[axis]) {
      const tmp = stop;
      stop = start;
      start = tmp;
    }

    let islands = new Set();
    for (let i = start[axis]; i < stop[axis]; i++) {
      let tileX = i;
      let tileY = start[otherAxis];
      if (direction === BoardDirections.VERTICAL) {
        tileX = start[otherAxis];
        tileY = i;
      }
      const island = this.getTile(tileX, tileY);
      if (island == null) {
        continue;
      }
      islands.add(island);
    }

    return islands;
  }
}
