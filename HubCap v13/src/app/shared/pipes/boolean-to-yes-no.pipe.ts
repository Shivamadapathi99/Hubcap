import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'booleanToYesNo'
})
export class BooleanToYesNoPipe implements PipeTransform {

  transform(value: any = '', args?: any): any {
    let newValue = value;

    if (value === 'true' || value === true) {
      newValue = 'Yes';
    }
    if (value === 'false' || value === false) {
      newValue = 'No';
    }
    return newValue;
  }

}
