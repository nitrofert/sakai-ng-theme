import { Pipe, PipeTransform } from '@angular/core';
import { pipeline } from 'stream';

@Pipe({
  name: 'dynamicFormat',
  
})
export class DynamicFormatPipe implements PipeTransform {

  transform(value: any, tipo:string): any  {
    
    /*switch (tipo) {
        case 'number':
            return (value.)
            break;
    
        default:
            return value;
            break;

    }*/

    return value;
  }

}
