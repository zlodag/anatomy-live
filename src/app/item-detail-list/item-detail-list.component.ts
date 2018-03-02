import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Field, FieldSpec, DETAIL_FIELDS } from '../models';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-item-detail-list',
  templateUrl: './item-detail-list.component.html',
  styleUrls: ['./item-detail-list.component.css']
})
export class ItemDetailListComponent implements OnInit {

  constructor() { }

  @Input() title: string;

  @Input() fields: Observable<Field[]>;

  @Input() edit: boolean = false;

  @Input() showQuizLink: boolean = false;

  ngOnInit() {
  }

  detailFields = DETAIL_FIELDS;
  selectedField: string = "";

  @Output() add = new EventEmitter<{
    field: string;
    entry: string;
  }>();
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
