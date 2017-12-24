import {Pipe} from '@angular/core';

/**
 * | urlencode
 */
@Pipe({
  name: 'urlencode'
})
export class UrlEncodePipe {
  transform(value: string): string {
    return encodeURI(value);
  }
}
