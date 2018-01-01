import {AbstractMap} from '../../app/maps/AbstractMap';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class GameLevelsService {

  protected maps: AbstractMap[] = [];
  protected mapsInitialized = false;

  constructor(private http: HttpClient) { }

  /**
   * Loads all map files (with title only) from API. Uses local array cache if it already exists.
   * @param {number} id
   * @return {Observable<AbstractMap>}
   */
  public loadLevels() {
    return new Observable<AbstractMap[]>(subscriber => {
      if (this.mapsInitialized) {
        // cache HTTP request...
        subscriber.next(this.maps);
        subscriber.complete();
        return;
      }
      this.http.get(environment.backendUrl + 'maps').subscribe((result: {success: boolean, data: any}) => {
        if (!result.success) {
          // error
          return;
        }
        const output = [];
        result.data.forEach(data => {
          const map = new AbstractMap();
          map.title = data.title;
          output.push(map);
        });
        this.maps = output;
        this.mapsInitialized = true;
        subscriber.next(output);
        subscriber.complete();
      });
    });
  }

  /**
   * Loads a single map file from API. Uses local array cache if it already exists.
   * @param {number} id
   * @return {Observable<AbstractMap>}
   */
  public loadLevel(id: number) {
    return new Observable<AbstractMap>(subscriber => {
      if (this.maps[ id - 1 ] && this.maps[ id - 1 ].getData()) {
        // cache request
        subscriber.next(this.maps[ id - 1 ]);
        subscriber.complete();
        return;
      }
      this.http.get(environment.backendUrl + 'maps/' + id)
        .subscribe((result: {success: boolean, data: any}) => {
          if (!result.success) {
            // error
            return;
          }
          const map = new AbstractMap();
          map.importFromJSON(result.data);

          // make sure all maps are available before updating the map object
          // as it is possible that not all maps have been loaded
          this.loadLevels().subscribe(
            () => {},
            () => {},
            () => {
              this.maps[ id - 1 ] = map;
            });
          subscriber.next(map);
          subscriber.complete();
      });
    });
  }
}
