import {Pipe} from '@angular/core';

/**
 * | urlencode
 */
@Pipe({
  name: 'urlencode'
})
export default class UrlEncodePipe {
  transform(value: string): string {
    return encodeURI(value);
  }
}
