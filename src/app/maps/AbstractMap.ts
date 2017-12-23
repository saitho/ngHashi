import {Island} from "../Island";

export abstract class AbstractMap {
  public abstract title: string;
  protected abstract data: Array<Array<Island>>;

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
}
