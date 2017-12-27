import {Island} from "../../app/Island";
import {NoAvailableIslandConnectionsError} from "../../app/game/Errors";
import {IGameEngineConnection} from "../../app/Connection";

export enum BoardDirections {
  HORIZONTAL = 1,
  VERTICAL = 2
}

export class GameEngine {

  protected static connections: IGameEngineConnection[];

  public static setConnections(connections: IGameEngineConnection[]) {
    this.connections = connections;
  }

  private static getIslandPos(island1: Island, island2: Island, direction: BoardDirections) {
    let island1_pos = '';
    let island2_pos = '';
    switch(direction) {
      case BoardDirections.HORIZONTAL:
        if (island1.xEnd < island2.xStart) {
          // island1: right, island2: left
          island1_pos = 'right';
          island2_pos = 'left';
        } else {
          // island1: left, island2: right
          island1_pos = 'left';
          island2_pos = 'right';
        }
        break;
      case BoardDirections.VERTICAL:
        if (island1.yEnd < island2.yStart) {
          // island1: bottom, island2: top
          island1_pos = 'bottom';
          island2_pos = 'top';
        } else {
          // island1: top, island2: bottom
          island1_pos = 'top';
          island2_pos = 'bottom';
        }
        break;
      default:
        throw new Error('Unknown direction...');
    }
    return [island1_pos, island2_pos];
  }

  private static connectionObstructed(island1: Island, island2: Island, direction: BoardDirections): boolean {

    const relevantConnections = this.connections.filter((connection) => {
      return connection.direction !== direction;
    });
    if (!relevantConnections.length) {
      // no relevant connections found: no obstruction
      return false;
    }

    let start, end, otherTileCoord;
    if (direction === BoardDirections.VERTICAL) {
      // check horizontal axis
      start = island1.tileCoords.x;
      end = island2.tileCoords.x;
      otherTileCoord = island1.tileCoords.y;
    } else {
      // check vertical axis
      start = island1.tileCoords.y;
      end = island2.tileCoords.y;
      otherTileCoord = island1.tileCoords.x;
    }
    if (start > end) {
      // make sure the smallest number is start point
      const tmp = start;
      start = end;
      end = tmp;
    }
    let wantedTiles = new Set();
    for (let i = ++start; i < end; i++) {
      wantedTiles.add(i);
    }

    for (let connection of relevantConnections) {
      let start = connection.start;
      let end = connection.end;

      let connectionAxis = new Set();
      for (let i = ++start; i < end; i++) {
        connectionAxis.add(i);
      }

      // Skip if connection will not occupy the same area on the other axis
      // (vertical for horizontal connections and vice versa)
      if (!connectionAxis.has(otherTileCoord)) {
        continue;
      }

      // obstruction if a wanted tile was already taken by the drawn connection
      if (wantedTiles.has(connection.otherAxis)) {
        return true;
      }

    }
    return false;
  }

  public static disconnectIslands(island1: Island, island2: Island, direction: BoardDirections, editorMode = false) {
    const islandPos = this.getIslandPos(island1, island2, direction);
    const island1_pos = islandPos[0];
    const island2_pos = islandPos[1];

    const index1 = island1.connections[island1_pos].indexOf(island2);
    island1.connections[island1_pos].splice(index1, 1);
    const index2 = island2.connections[island2_pos].indexOf(island1);
    island2.connections[island2_pos].splice(index2, 1);

    if (editorMode) {
      island1.bridges = island1.countConnections() ? island1.countConnections() : 1;
      island2.bridges = island2.countConnections() ? island2.countConnections() : 1;
    }
  }

  public static connectIslands(island1: Island, island2: Island, direction: BoardDirections, editorMode = false) {
    // Check if maximum connections are reached
    if (
      (island1.isComplete() || island2.isComplete()) && !editorMode
    ) {
      throw new NoAvailableIslandConnectionsError('An island reached its maximum connections.');
    }

    const islandPos = this.getIslandPos(island1, island2, direction);
    const island1_pos = islandPos[0];
    const island2_pos = islandPos[1];
    if (island1.connections[island1_pos].length == 2 || island2.connections[island2_pos].length == 2) {
      throw new NoAvailableIslandConnectionsError('A side of an island reached its maximum connections.');
    }

    if (this.connectionObstructed(island1, island2, direction)) {
      throw new NoAvailableIslandConnectionsError('Bridges must not cross each other.');
    }

    island1.connections[island1_pos].push(island2);
    island2.connections[island2_pos].push(island1);

    if (editorMode) {
      island1.bridges = island1.countConnections();
      island2.bridges = island2.countConnections();
    }
  }
}
