import {Island} from "../Island";
import {AbstractMap} from "./AbstractMap";

export default class NgHashiMap extends AbstractMap {
  public title: string = 'ngHashi';
  protected data: Array<Array<Island>> = [
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
      new Island(2),
      new Island(0),
      new Island(4),
      new Island(0),
      new Island(2),
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
      new Island(1),
      new Island(0),
      new Island(3),
      new Island(0),
      new Island(3),
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
      new Island(1),
      new Island(0),
      new Island(2),
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
