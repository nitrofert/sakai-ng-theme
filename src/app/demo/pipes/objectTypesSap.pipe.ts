import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objectType'
})
export class ObjectTypesPipe implements PipeTransform {

  transform(value: string): string  {
    switch (value) {
      case '17':
          return 'FPD'
      break;

      case '1250000001':
          return 'CONSIGNA'
      break;

      case '13':
          return 'FPP'
      break;

    //   case 'aprobacion':
    //       return 'FPD'
    //   break;

      default: return value
    }
  }

}
