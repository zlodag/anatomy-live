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

  @Output() update = new EventEmitter();
  @Output() delete = new EventEmitter<string>();

  addEntry = (field: string, list: string[] | void, newEntry: string) => {
    const newFields = [];
    if (list) {
      list.forEach(value => newFields.push(value));
    }
    newFields.push(newEntry);
    this.update.emit({[field]: newFields});
  }

  removeEntry = (field: string, list: string[], index: number) => {
      const newFields = [];
      list.forEach((value, i) => {
        if (i !== index) {
          newFields.push(value);
        }
      })
      if (newFields.length) {
        this.update.emit({[field]: newFields});
      } else {
        this.delete.emit(field);
      }
  }

  updateEntry = (field: string, list: string[], index: number, newEntry: string) => {
    if (newEntry) {
      newEntry = newEntry.trim();
      if (newEntry) {
        const newFields = [];
        list.forEach((value, i) => {
          if (i === index) {
            newFields.push(newEntry);
          } else {
            newFields.push(value);
          }
        })
        this.update.emit({[field]: newFields});
      }
    }
  }

}
