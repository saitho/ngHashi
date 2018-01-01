import {AbstractMap} from '../../app/maps/AbstractMap';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable()
export class GameLevelsService {

  protected maps: AbstractMap[] = [];
  protected init = false;

  private loadMap(path: string): Promise<any> {
    const observable = this.http.get(path, {responseType: 'json'}).toPromise();
    observable
      .then((result: any) => {
      const map = new AbstractMap();
      map.importFromJSON(result);
      this.maps.push(map);
    })
      .catch((error) => console.log(error));
    return observable;
  }

  private loadMaps() {
    return Promise.all([
      this.loadMap('_maps/wikipediaExample.json'),
      this.loadMap('_maps/ngHashi.json'),
      this.loadMap('_maps/sushi1.json'),
      this.loadMap('_maps/miniPlatines.json')
    ]);
  }

  constructor(
    private http: HttpClient
  ) {
    this.loadMaps();
    this.init = true;
  }


  getLevels(): AbstractMap[] {
    return this.maps;
  }

  getLevel(key: number): AbstractMap {
    return this.maps[key];
  }
}
