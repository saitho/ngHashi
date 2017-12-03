import {Island} from "../Island";

export abstract class AbstractMap {
  protected abstract title: string;
  protected abstract data: Array<Array<Island>>;
  protected fieldsSet = false;

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
    for(let i = 0; i < this.data.length; i++) {
      for(let j = 0; j < this.data[i].length; j++) {
        const item = this.data[i][j];
        if (item.bridges > 0 && !item.isComplete()) {
          return false;
        }
      }
    }
    return true;
  }

  public getData() {
    if (!this.fieldsSet) {
      this.data.forEach((value, index) => {
        value.forEach((item, index2) => {
          item.map = {x: index, y: index2};
        })
      });
      this.fieldsSet = true;
    }
    return this.data;
  }
}
