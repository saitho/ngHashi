import {Island} from "../Island";
import {NoAvailableIslandConnectionsError} from "./Errors";

export enum BoardDirections {
  HORIZONTAL = 1,
  VERTICAL = 2
}

export class GameEngine {

  private getIslandPos(island1: Island, island2: Island, direction: BoardDirections) {
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

  public disconnectIslands(island1: Island, island2: Island, direction: BoardDirections) {
    const islandPos = this.getIslandPos(island1, island2, direction);
    const island1_pos = islandPos[0];
    const island2_pos = islandPos[1];

    const index1 = island1.connections[island1_pos].indexOf(island2);
    island1.connections[island1_pos].splice(index1, 1);
    const index2 = island2.connections[island2_pos].indexOf(island1);
    island2.connections[island2_pos].splice(index2, 1);
  }

  public connectIslands(island1: Island, island2: Island, direction: BoardDirections) {
    // Check if maximum connections are reached
    if (island1.countConnections() == island1.bridges) {
      throw new NoAvailableIslandConnectionsError('Island 1 reached ' + island1.bridges +' connections.');
    }
    if (island2.countConnections() == island2.bridges) {
      throw new NoAvailableIslandConnectionsError('Island 2 reached ' + island2.bridges +' connections.');
    }

    const islandPos = this.getIslandPos(island1, island2, direction);
    const island1_pos = islandPos[0];
    const island2_pos = islandPos[1];
    if (island1.connections[island1_pos].length == 2) {
      throw new NoAvailableIslandConnectionsError(island1_pos+ ' side of island 1 reached 2 connections.');
    }
    if (island2.connections[island2_pos].length == 2) {
      throw new NoAvailableIslandConnectionsError(island2_pos+ 'side of island 2 reached 2 connections.');
    }
    island1.connections[island1_pos].push(island2);
    island2.connections[island2_pos].push(island1);
  }
}
