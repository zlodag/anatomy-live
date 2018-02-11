import { Pipe, PipeTransform } from '@angular/core';
import { Details } from './models';

@Pipe({
  name: 'fieldFilter'
})
export class FieldFilterPipe implements PipeTransform {

  transform(allFields: string[], itemDetails: Details): string[] {
    return allFields.filter(field => itemDetails[field]);
  }

}
