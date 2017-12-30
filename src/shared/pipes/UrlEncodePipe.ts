import {Pipe, PipeTransform} from '@angular/core';

/**
 * | urlencode
 */
@Pipe({
  name: 'urlencode'
})
export class UrlEncodePipe implements PipeTransform {
  transform(value: string): string {
    return encodeURI(value);
  }
}
