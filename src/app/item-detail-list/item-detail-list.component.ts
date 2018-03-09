import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Field, DETAIL_FIELDS } from '../models';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-item-detail-list',
  templateUrl: './item-detail-list.component.html',
})
export class ItemDetailListComponent {

  @Input() edit = false;

  @Input() fields: Observable<Field[]>;

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
