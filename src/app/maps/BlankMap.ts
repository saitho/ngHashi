import {Island} from "../Island";
import {AbstractMap} from "./AbstractMap";

export default class BlankMap extends AbstractMap {
  constructor() {
    super();
    this.title = '';
    this.data = [
      [
        new Island(0),
        new Island(0),
        new Island(0),
        new Island(0),
        new Island(0),
        new Island(0),
        new Island(0)
      ],
      [
        new Island(0),
        new Island(0),
        new Island(0),
        new Island(0),
        new Island(0),
        new Island(0),
        new Island(0)
      ],
      [
        new Island(0),
        new Island(0),
        new Island(0),
        new Island(0),
        new Island(0),
        new Island(0),
        new Island(0)
      ],
      [
        new Island(0),
        new Island(0),
        new Island(0),
        new Island(0),
        new Island(0),
        new Island(0),
        new Island(0)
      ],
      [
        new Island(0),
        new Island(0),
        new Island(0),
        new Island(0),
        new Island(0),
        new Island(0),
        new Island(0)
      ],
      [
        new Island(0),
        new Island(0),
        new Island(0),
        new Island(0),
        new Island(0),
        new Island(0),
        new Island(0)
      ],
      [
        new Island(0),
        new Island(0),
        new Island(0),
        new Island(0),
        new Island(0),
        new Island(0),
        new Island(0)
      ],
    ];
  }
}
