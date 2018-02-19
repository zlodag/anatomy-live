import { Pipe, PipeTransform } from '@angular/core';
import { Details, DetailField, DETAIL_FIELDS, QuizDetail } from './models';

@Pipe({
  name: 'detailFields'
})
export class DetailFieldFilterPipe implements PipeTransform {
  transform = (itemDetails: Details, getAll: boolean): DetailField[] => getAll ? DETAIL_FIELDS : DETAIL_FIELDS.filter((field) => itemDetails[field.key]);
}

@Pipe({
  name: 'subItemsDone',
  // pure: false,
})
export class SubItemsDoneFilter implements PipeTransform {
  transform = (subItems: QuizDetail[]): QuizDetail[] => {
  	const ret = subItems.filter(subItem => subItem.done);
  	console.log(JSON.stringify(ret));
  	return ret;
  }
}
