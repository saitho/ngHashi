import {Island} from '../Island';
import {AbstractMap} from './AbstractMap';
import {GameEngine, BoardDirections} from '../../shared/helper/GameEngine';

export default class EditorMap extends AbstractMap {
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

  /**
   * Adjustments for special editor format also containing the bridges
   * @inheritDoc
   */
  public importFromJSON(object: any) {
    super.importFromJSON(object.map);
    object.editor.connections.forEach(editorConnection => {
      ['left', 'top'].forEach((direction) => {
        const currentDirection = editorConnection.connections[direction];
        currentDirection.forEach(otherIslandPos => {
          GameEngine.connectIslands(
            this.data[editorConnection.pos.x][editorConnection.pos.y],
            this.data[otherIslandPos.x][otherIslandPos.y],
            direction === 'left' ? BoardDirections.HORIZONTAL : BoardDirections.VERTICAL,
            true
          );
        });
      });
    });
  }

  /**
   * Exports the editor map into a JSON string.
   * Unlike the 'regular' export this also contains the set connections.
   * @return {string}
   */
  public exportEditorObject() {
    const regular = this.exportObject();

    const data = [];
    for (let i = 0; i < this.data.length; i++) {
      for (let j = 0; j < this.data[i].length; j++) {
        if (!this.data[i][j].countConnections()) {
          continue;
        }
        const connections = {left: [], top: []};
        ['left', 'top'].forEach((direction) => {
          this.data[i][j].connections[direction].forEach((island) => {
            connections[direction].push(island.tileCoords);
          });
        });
        data.push({
          pos: this.data[i][j].tileCoords,
          connections: connections
        });
      }
    }

    return JSON.stringify({
      map: JSON.parse(regular),
      editor: {
        'connections': data,
      }
    });
  }
}
