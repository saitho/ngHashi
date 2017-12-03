import {BoardDirections, GameEngine} from "./GameEngine";
import {AbstractMap} from "../maps/AbstractMap";
import {Island} from "../Island";

export class HashiSolver {
  private map: AbstractMap;
  private mapData;
  private game: GameEngine;

  constructor(map: AbstractMap) {
    this.game = new GameEngine();
    this.map = map;
    this.mapData = map.getData();
  }

  private findLowestBridgesNeeded(): Island {
    let lowest: Island = null;
    this.mapData.forEach(firstLevel => {
      firstLevel.forEach(item => {
        if (
          (!item.bridges) ||
          (item.requiredBriges() == 0) ||
          (lowest != null && item.requiredBriges() > lowest.requiredBriges())
        ) {
          return;
        }
        lowest = item;
      })
    });
    return lowest;
  }

  private findNearbyIslandOnAxis(side: string, island: Island) {
    let direction = BoardDirections.VERTICAL;
    if (side == 'top' || side == 'bottom') {
      direction = BoardDirections.HORIZONTAL;
    }

    let nearby: Island = null;
    let mapAxis = 'x';
    let mapNearest = 'y';
    if (direction == BoardDirections.HORIZONTAL) {
      mapAxis = 'y';
      mapNearest = 'x';
    }
    const islandMap = island.map;

    this.mapData.forEach(firstLevel => {
      firstLevel.forEach(item => {
        if ((!item.bridges) ||item == island) {
          return;
        }
        if (item.map[mapAxis] != islandMap[mapAxis]) {
          return;
        }

        if (
          ((side == 'left' || side == 'top') && item.map[mapNearest] > islandMap[mapNearest]) ||
          ((side == 'right' || side == 'bottom') && item.map[mapNearest] < islandMap[mapNearest])
        ) {
          return;
        }

        if (
          nearby &&
          Math.abs(islandMap[mapNearest]-nearby.map[mapNearest]) < Math.abs(islandMap[mapNearest]-item.map[mapNearest])
        ) {
          return;
        }
        nearby = item;
      })
    });
    return nearby;
  }

  private findAvailableConnections(island: Island) {
    const connections: {direction: BoardDirections, island: Island}[] = [];
    const top = this.findNearbyIslandOnAxis('top', island);
    const bottom = this.findNearbyIslandOnAxis('bottom', island);
    const left = this.findNearbyIslandOnAxis('left', island);
    const right = this.findNearbyIslandOnAxis('right', island);
    if (top != null) {
      connections.push({direction: BoardDirections.VERTICAL, island: top});
    }
    if (bottom != null) {
      connections.push({direction: BoardDirections.VERTICAL, island: bottom});
    }
    if (left != null) {
      connections.push({direction: BoardDirections.HORIZONTAL, island: left});
    }
    if (right != null) {
      connections.push({direction: BoardDirections.HORIZONTAL, island: right});
    }

    return connections;
  }

  public makeTurn() {
    const island = this.findLowestBridgesNeeded();
    console.log(island.requiredBriges());
    const connections = this.findAvailableConnections(island);
    let connected: {connectedIsland: Island, direction: BoardDirections}[] = [];
    for(let i = 0; i < connections.length; i++) {
      try {
        const connectedIsland = connections[i].island;
        const direction = connections[i].direction;
        this.game.connectIslands(island, connectedIsland, direction);
        // save step to be able to revert it later
        connected.push({connectedIsland: connectedIsland, direction: direction});
      } catch(e) {
        // Rollback on error
        connected.forEach(value => {
          this.game.disconnectIslands(island, value.connectedIsland, value.direction);
        });
      }
      // if (!this.map.isSolved()) {
      //   this.makeTurn();
      // }
    }
  }

  public makeTurn2(island: Island) {
    const connections = this.findAvailableConnections(island);
    let rollbackList: {connectedIsland: Island, direction: BoardDirections}[] = [];
    for(let i = 0; i < connections.length; i++) {
      try {
        const connectedIsland = connections[i].island;
        const direction = connections[i].direction;
        this.game.connectIslands(island, connectedIsland, direction);
        console.log('connecting', island.map, connectedIsland.map);
        // save step to be able to revert it later
        rollbackList.push({connectedIsland: connectedIsland, direction: direction});
        if (this.map.isSolved()) {
          return;
        }
        // this.makeTurn2(connectedIsland);
      } catch(e) {
        // Rollback on error
        rollbackList.forEach((value) => {
          console.log('disconnecting', island.map, value.connectedIsland.map);
          this.game.disconnectIslands(island, value.connectedIsland, value.direction);
        });
        rollbackList = [];
      }
    }
  }

  public solve() {
    console.log('hello world');
    const island = this.findLowestBridgesNeeded();
    this.makeTurn2(island);
    //this.makeTurn();
  }
}
