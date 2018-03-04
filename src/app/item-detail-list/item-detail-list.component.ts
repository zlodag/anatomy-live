import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Field, DETAIL_FIELDS } from '../models';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-item-detail-list',
  templateUrl: './item-detail-list.component.html',
})
export class ItemDetailListComponent {

  constructor() { }

  @Input() title: string;

  @Input() fields: Observable<Field[]>;

  @Input() edit = false;

  @Input() showQuizLink = false;

  @Output() set = new EventEmitter<{
    field: string;
    entryKey: string;
    entry: string;
  }>();

  @Output() remove = new EventEmitter<{
    field: string;
    entryKey: string;
  }>();

}
