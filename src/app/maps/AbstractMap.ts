import {Island} from "../Island";

export class AbstractMap {
  public title: string;
  public themeName: string = 'Nikoli Classic';
  protected data: Array<Array<Island>>;

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

  public exportObject() {
    const data = [];
    for(let i=0; i < this.data.length; i++) {
      const subarray = [];
      for (let j = 0; j < this.data[i].length; j++) {
        subarray.push(this.data[i][j].bridges);
      }
      data.push(subarray);
    }
    return JSON.stringify({
      "title": this.title,
      "themeName": this.themeName,
      "data": data,
    });
  }

  /**
   * Resets bridges on every island
   */
  public reset() {
    this.data.forEach(firstLevel => {
      firstLevel.forEach(item => {
        item.connections = {
          top: [],
          bottom: [],
          left: [],
          right: []
        };
      })
    });
  }

  /**
   * No need to check for connected graphs here as we assume all levels were validated through the editor before.
   * @return {boolean}
   */
  public isSolved(): boolean {
    for(let i=0; i < this.data.length; i++) {
      for (let j = 0; j < this.data[i].length; j++) {
        const island: Island = this.data[i][j];
        if (!island.isComplete()) {
          return false;
        }
      }
    }
    return true;
  }

  public getData() {
    return this.data;
  }

  public setData(data: Array<Array<Island>>) {
    this.data = data;
  }
}
