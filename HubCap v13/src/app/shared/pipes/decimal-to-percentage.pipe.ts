import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decimalToPercentage'
})
export class DecimalToPercentagePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return value * 100;
  }

}
