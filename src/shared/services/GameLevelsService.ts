import {AbstractMap} from "../../app/maps/AbstractMap";
import {HttpClient} from "@angular/common/http";
import {Island} from "../../app/Island";
import {Injectable} from "@angular/core";

@Injectable()
export class GameLevelsService {

  protected maps: AbstractMap[] = [];
  protected init = false;

  private loadMap(path: string): Promise<any> {
    let observable = this.http.get(path, {responseType: 'json'}).toPromise();
    observable
      .then((result: any) => {
      const data: Array<Array<Island>> = [];
      let i = 0;
      result.data.forEach((row) => {
        const innerArray: Island[] = [];
        row.forEach((column) => {
          innerArray.push(new Island(column));
        });
        data.push(innerArray);
        i++;
      });
      this.maps.push(
        new AbstractMap(result.title, data, result.themeName)
      );
    })
      .catch((error) => console.log(error));
    return observable;
  }

  private loadMaps(){
    return Promise.all([
      this.loadMap("_maps/wikipediaExample.json"),
      this.loadMap("_maps/ngHashi.json"),
      this.loadMap("_maps/sushi1.json")
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
