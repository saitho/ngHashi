import {Pipe, PipeTransform} from '@angular/core';

/**
 * | timerformat
 */
@Pipe({
  name: 'timerformat'
})
export class TimerFormatPipe implements PipeTransform {
  transform(value: number): string {
    let minutes = Math.floor(value / 60).toString();
    if (minutes.length === 1) {
      minutes = '0' + minutes;
    }
    let seconds = (value % 60).toString();
    if (seconds.length === 1) {
      seconds = '0' + seconds;
    }

    return minutes + ':' + seconds;
  }
}
