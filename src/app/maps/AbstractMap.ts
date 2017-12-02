import {Island} from "../Island";

export abstract class AbstractMap {
  protected data: Array<Array<Island>>;

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

  public getData() {
    return this.data;
  }
}
