import { Pipe, PipeTransform } from '@angular/core';
import { pipeline } from 'stream';

@Pipe({
  name: 'objecrString',
  
})
export class ObjectStringPipe implements PipeTransform {

  transform(value: any, key?:string): any  {
    
    if(!key) return value;

    let objeto = JSON.parse(value);

    //////console.log(objeto);

    return objeto[key];

  }

}
