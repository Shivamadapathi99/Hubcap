import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'zeroOneToYesNo'
})
export class ZeroOneToYesNoPipe implements PipeTransform {

  transform(value: any = '', args?: any): any {
    let newValue = value;

    if (value === '0' || value === 0) {
      newValue = 'Yes';
    }
    if (value === '1' || value === 1) {
      newValue = 'No';
    }
    return newValue;
  }

}
