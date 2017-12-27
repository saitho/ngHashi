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

  xStart: number;
  xEnd: number;
  yStart: number;
  yEnd: number;

  connections: {top: Array<Island>; bottom: Array<Island>; left: Array<Island>; right: Array<Island>} = {
    top: [],
    bottom: [],
    left: [],
    right: []
  };

  countConnections() {
    return this.connections.top.length +
      this.connections.bottom.length +
      this.connections.left.length +
      this.connections.right.length;
  }

  isComplete(): boolean {
    return this.bridges == this.countConnections();
  }

  getSymbol() {
    if (this.bridges) {
      return this.bridges;
    }
    return '';
  }
}
