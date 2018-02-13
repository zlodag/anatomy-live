import { Pipe, PipeTransform } from '@angular/core';
import { Details, DetailField } from './models';

@Pipe({
  name: 'detailFieldFilter'
})
export class DetailFieldFilterPipe implements PipeTransform {

  transform(items: DetailField[], itemDetails: Details): DetailField[] {
    return items.filter(field => itemDetails[field.key]);
  }

}
