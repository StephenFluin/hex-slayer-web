import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'range'
})
export class RangePipe implements PipeTransform {

  transform(value: number, args?: any): any {
    return Array.from(Array(value).keys());
  }

}