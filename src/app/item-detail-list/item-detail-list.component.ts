import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Details } from '../models';
import { Observable } from 'rxjs/Observable';
import { PrintField } from '../models';

@Component({
  selector: 'app-item-detail-list',
  templateUrl: './item-detail-list.component.html',
  styleUrls: ['./item-detail-list.component.css']
})
export class ItemDetailListComponent implements OnInit {

  constructor() { }

  @Input() title: string;

  @Input() details: Observable<PrintField[]>;

  @Input() edit: boolean = false;

  @Input() showQuizLink: boolean = false;

  ngOnInit() {
  }

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
