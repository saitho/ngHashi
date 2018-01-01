import {Response, Router} from 'express';
import {AbstractRouter} from './AbstractRouter';

export default class CustomerRouter extends AbstractRouter {
  constructor() {
    super();
    this.setRoutes();
  }

  public setRoutes() {
    this.router.route('/')
      .get((req, res: Response) => {
        res.send('Hello World!');
      });
  }

  public getRouter(): Router {
    return this.router;
  }
}
