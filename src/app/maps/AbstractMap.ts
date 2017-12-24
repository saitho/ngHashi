import {Island} from "../Island";

export class AbstractMap {
  public title: string;
  public themeName: string;
  protected data: Array<Array<Island>>;

  constructor(
    title: string,
    data: Array<Array<Island>>,
    themeName: string = 'Nikoli Classic'
  ) {
    this.title = title;
    this.data = data;
    this.themeName = themeName;
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
