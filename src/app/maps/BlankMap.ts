import {Island} from "../Island";
import {AbstractMap} from "./AbstractMap";

export default class BlankMap extends AbstractMap {
  public title: string = '';
  public data: Array<Array<Island>> = [
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
