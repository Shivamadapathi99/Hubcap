import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateText'
})
export class TruncateTextPipe implements PipeTransform {

  transform(value: string = ' ', limit = 25, completeWords = false, ellipsis = '...') {
    if (value !== null) {
      if (completeWords) {
        limit = value.substr(0, 13).lastIndexOf(' ');
      }
      return `${value.substr(0, limit)}${ellipsis}`;
    }
    return '';
  }

}
