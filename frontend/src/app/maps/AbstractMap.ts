import {Coords, Island} from '../Island';

export class AbstractMap {
  public title: string;
  public themeName = 'Nikoli Classic';
  protected data: Array<Array<Island>>;
  public timer = 0;
  protected timerActive = null;
  private depthSearchMarkers = new Set<Coords>();

  /**
   * Starts the timer
   */
  public startTimer() {
    if (this.timerActive) {
      return;
    }
    this.timerActive = setInterval(() => {
      this.timer++;
    }, 1000);
  }

  /**
   * Stops the timer
   */
  public stopTimer() {
    if (!this.timerActive) {
      return;
    }
    clearInterval(this.timerActive);
    this.timerActive = null;
  }

  /**
   * Copy data from JSON object into this Map object
   * @param object
   */
  public importFromJSON(object: any) {
    const data: Array<Array<Island>> = [];
    let i = 0;
    object.data.forEach((row) => {
      const innerArray: Island[] = [];
      row.forEach((column) => {
        innerArray.push(new Island(column));
      });
      data.push(innerArray);
      i++;
    });
    this.title = object.title;
    this.data = data;
    if (object.hasOwnProperty('themeName')) {
      this.themeName = object.themeName;
    }
  }

  /**
   * Create a JSON string from the current Map
   * @return {string}
   */
  public exportObject() {
    const data = [];
    for (let i = 0; i < this.data.length; i++) {
      const subarray = [];
      for (let j = 0; j < this.data[i].length; j++) {
        subarray.push(this.data[i][j].bridges);
      }
      data.push(subarray);
    }
    return JSON.stringify({
      'title': this.title,
      'themeName': this.themeName,
      'data': data,
    });
  }

  /**
   * Resets bridges on every island and the timer
   */
  public reset() {
    this.stopTimer();
    this.timer = 0;
    this.data.forEach(firstLevel => {
      firstLevel.forEach(item => {
        item.connections = {
          top: [],
          bottom: [],
          left: [],
          right: []
        };
      });
    });
  }

  /**
   * Checks if map is solved
   * @return {boolean}
   */
  public isSolved(): boolean {
    for (let i = 0; i < this.data.length; i++) {
      for (let j = 0; j < this.data[i].length; j++) {
        const island: Island = this.data[i][j];
        if (!island.isComplete()) {
          return false;
        }
      }
    }
    return this.isConnectedGraph();
  }

  /**
   * Returns map data
   * @return {Array<Array<Island>>}
   */
  public getData() {
    return this.data;
  }

  /**
   * Performs depthSearch algorithm for one island
   * @param {Island} island
   */
  private depthSearch(island: Island) {
    if (this.depthSearchMarkers.has(island.tileCoords)) {
      return;
    }
    this.depthSearchMarkers.add(island.tileCoords);
    ['left', 'right', 'top', 'bottom'].forEach(direction => {
      island.connections[direction].forEach((island2) => this.depthSearch(island2));
    });
  }

  /**
   * Checks if all islands are connected
   * @return {boolean}
   */
  public isConnectedGraph() {
    // use depth search to also check if we have a connected graph
    const map = this.data;
    this.depthSearchMarkers.clear();

    let start = null;
    let counter = 0;
    // remove maps without bridges (= empty entries)
    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[i].length; j++) {
        if (!map[i][j].bridges) {
          continue;
        }
        if (start === null) {
          start = map[i][j];
        }
        counter++;
      }
    }

    if (counter < 2) {
      return false;
    }

    this.depthSearch(start);

    return this.depthSearchMarkers.size === counter;
  }
}
