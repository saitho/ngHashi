import {Request, Response, Router} from 'express';
import {AbstractRouter} from './AbstractRouter';
import * as fs from 'fs';

const MAPFOLDER = __dirname + '/../../_maps/';

export default class CustomerRouter extends AbstractRouter {
  constructor() {
    super();
    this.setRoutes();
  }

  protected readMapFile(filePath: string) {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  }

  public setRoutes() {
    this.router.route('/')
      .get((req, res: Response) => {
        res.json('Hello World!');
      });
    this.router.route('/maps/')
      .get((req, res: Response) => {
        const output: any[] = [];
        let i = 1;
        fs.readdirSync(MAPFOLDER).forEach(file => {
          const map = this.readMapFile(MAPFOLDER + file);
          output.push({
            id: i,
            title: map.title,
            link: '/api/maps/' + i
          });
          i++;
        });
        this.returnSuccess(res, output);
      });
    this.router.route('/maps/:id')
      .get((req: Request, res: Response) => {
        const mapId = Number(req.params.id);
        if (!mapId) {
          // error
          this.returnError(res, 500, 'Invalid ID.');
          return;
        }
        const maps = fs.readdirSync(MAPFOLDER);
        if (mapId > maps.length) {
          // error
          this.returnError(res, 404, 'Map not found.');
          return;
        }
        this.returnSuccess(res, this.readMapFile(MAPFOLDER + maps[ mapId - 1 ]));
      });
  }

  public getRouter(): Router {
    return this.router;
  }
}
