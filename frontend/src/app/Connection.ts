import {Island} from './Island';
import {BoardDirections} from '../shared/helper/GameEngine';

export interface IGameEngineConnection {
  direction: BoardDirections;
  start:  number;
  end: number;
  otherAxis: number;
  island: Island;
  connectedIsland: Island;
}


export interface Connection extends IGameEngineConnection {
  startPx:  number;
  endPx: number;
  otherAxisPx: number;
}
