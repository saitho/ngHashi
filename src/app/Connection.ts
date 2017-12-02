import {Island} from "./Island";
import {BoardDirections} from "./game/GameEngine";

export interface Connection {
    direction: BoardDirections,
      otherAxis: number;
    start:  number;
    end: number;
    island: Island;
    connectedIsland: Island
}
