import {Island} from "../Island";
import map from "../maps/GameMaps";
import {InvalidTurnError, NoAvailableIslandConnectionsError} from "./Errors";

export enum BoardDirections {
  HORIZONTAL = 1,
  VERTICAL = 2
}

export class GameEngine {
  public putBridge(x1, y1, x2, y2) {
    const direction = this.getLineDirection(x1, y1, x2, y2);
    const islands = this.getIslandInRange(x1, y1, x2, y2);
    if (islands.size !== 2 || direction === null) {
      throw new InvalidTurnError();
    }

    // connect islands on background canvas and clear drawing canvas
    let iter = islands.entries();
    this.connectIslands(iter.next().value[0], iter.next().value[1], direction);
  }

  private getIsland(x, y, allowNoBridges = false): Island {
    for(let i=0; i < map.length; i++) {
      for(let j=0; j < map[i].length; j++) {
        const island = map[i][j];
        if (island.bridges == 0 && !allowNoBridges) {
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

  public hasIsland(x, y, allowNoBridges = false): boolean {
    return !(this.getIsland(x, y, allowNoBridges) == null);
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
          const island = this.getIsland(x1, i);
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
          const island = this.getIsland(i, y1);
          if (island == null) {
            continue;
          }
          islands.add(island);
        }
        break;
      default:
        console.log('undefined');
        break;
    }
    return islands;
  }

  private connectIslands(island1: Island, island2: Island, direction) {

    if (island1.countConnections() == island1.bridges) {
      throw new NoAvailableIslandConnectionsError('Island 1 reached ' + island1.bridges +' connections.');
    }
    if (island2.countConnections() == island2.bridges) {
      throw new NoAvailableIslandConnectionsError('Island 2 reached ' + island2.bridges +' connections.');
    }

    switch(direction) {
      case BoardDirections.HORIZONTAL:
        if (island1.xEnd < island2.xStart) {
          // island1: right, island2: left
          if (island1.connections.right.length == 2) {
            throw new NoAvailableIslandConnectionsError('Right side of island 1 reached 2 connections.');
          }
          if (island2.connections.left.length == 2) {
            throw new NoAvailableIslandConnectionsError('Left side of island 2 reached 2 connections.');
          }
          island1.connections.right.push(island2);
          island2.connections.left.push(island1);
        }else {
          // island1: left, island2: right
          if (island1.connections.left.length == 2) {
            throw new NoAvailableIslandConnectionsError('Left side of island 1 reached 2 connections.');
          }
          if (island2.connections.right.length == 2) {
            throw new NoAvailableIslandConnectionsError('Right side of island 2 reached 2 connections.');
          }
          island1.connections.left.push(island2);
          island2.connections.right.push(island1);
        }
        break;
      case BoardDirections.VERTICAL:
        if (island1.yEnd < island2.yStart) {
          // island1: bottom, island2: top
          if (island1.connections.bottom.length == 2) {
            throw new NoAvailableIslandConnectionsError('Bottom side of island 1 reached 2 connections.');
          }
          if (island2.connections.top.length == 2) {
            throw new NoAvailableIslandConnectionsError('Top side of island 2 reached 2 connections.');
          }
          if (island1.connections.bottom.length == 2 || island1.connections.top.length == 2) {
            throw new NoAvailableIslandConnectionsError();
          }
          island1.connections.bottom.push(island2);
          island2.connections.top.push(island1);
        }else {
          // island1: top, island2: bottom
          if (island1.connections.top.length == 2) {
            throw new NoAvailableIslandConnectionsError('Top side of island 1 reached 2 connections.');
          }
          if (island2.connections.bottom.length == 2) {
            throw new NoAvailableIslandConnectionsError('Bottom side of island 2 reached 2 connections.');
          }
          island1.connections.top.push(island2);
          island2.connections.bottom.push(island1);
        }
        break;
      default:
        break;
    }
  }
}
