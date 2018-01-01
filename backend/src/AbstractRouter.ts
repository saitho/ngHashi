import {Response, Router} from 'express';

export abstract class AbstractRouter {
  protected router: Router;

  constructor() {
    this.router = Router();
  }

  returnSuccess(res: Response, data: any) {
    res.status(200).json(data);
  }

  returnError(res: Response, code: number, message: string) {
    res.status(code).json( { success: false, message: message} );
  }

  returnControllerError(res: Response, e: Error) {
    this.returnError(res, 500, e.message);
  }

  extractValidAttributes(validAttributes: string[], src: any) {
    const dest = {};
    validAttributes.forEach((attribute) => {
      if (src.hasOwnProperty(attribute)) {
        dest[attribute] = src[attribute];
      }
    });

    if (!Object.keys(dest).length) {
      throw new Error('You have to specify at least one attribute: ' + validAttributes.join(','));
    }
    return dest;
  }
}
