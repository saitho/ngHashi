export interface Coords {
  x: number;
  y: number;
}

export class Island {
  constructor(bridges: number = 0) {
    this.bridges = bridges;
  }
  init = false;

  bridges: number;

  tileCoords: Coords;
  pxCoordsStart: Coords;
  pxCoordsEnd: Coords;

  connections: {top: Array<Island>; bottom: Array<Island>; left: Array<Island>; right: Array<Island>} = {
    top: [],
    bottom: [],
    left: [],
    right: []
  };

  /**
   * Sums all connections
   * @return {number}
   */
  countConnections() {
    return this.connections.top.length +
      this.connections.bottom.length +
      this.connections.left.length +
      this.connections.right.length;
  }

  /**
   * Checks the island has the required number of bridges
   * @return {boolean}
   */
  isComplete(): boolean {
    return this.bridges === this.countConnections();
  }
}
