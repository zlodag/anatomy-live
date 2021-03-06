import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Field, Entry } from '../models';

@Component({
  selector: 'app-item-detail-list',
  templateUrl: './item-detail-list.component.html',
})
export class ItemDetailListComponent {

  @Input() edit = false;

  @Input() fields: Field[];

  @Output() set = new EventEmitter<{
    field: string;
    entryKey: string;
    entry: string;
  }>();

  @Output() remove = new EventEmitter<{
    field: string;
    entryKey: string;
  }>();

  @Output() swap = new EventEmitter<{
    field: string;
    entry1: Entry;
    entry2: Entry;
  }>();

}
