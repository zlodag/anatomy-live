import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Details } from '../models';
import { firestore } from 'firebase';

@Component({
  selector: 'app-item-detail-list',
  templateUrl: './item-detail-list.component.html',
  styleUrls: ['./item-detail-list.component.css']
})
export class ItemDetailListComponent implements OnInit {

  constructor() { }

  @Input() title: string;

  @Input() details: Details;

  @Input() edit: boolean = false;

  @Input() showQuizLink: boolean = false;

  ngOnInit() {
  }

  @Output() update = new EventEmitter();

  addEntry = (field: string, list: string[] | void, newEntry: string) => {
    const updateObj = {};
    updateObj[field] = [];
    if (list) {
      for (let i = 0; i < list.length; ++i) {
        updateObj[field].push(list[i]);
      }
    }
    updateObj[field].push(newEntry);
    this.update.emit(updateObj);
  }

  removeEntry = (field: string, list: string[], index: number) => {
    // if (confirm(`Are you sure you want to remove "${list[index]}"?`)) {
      const updateObj = {};
      updateObj[field] = [];
      for (let i = 0; i < list.length; i++) {
        if (i !== index) {
          updateObj[field].push(list[i]);
        }
      }
      if (!updateObj[field].length) {
        updateObj[field] = firestore.FieldValue.delete();
      }
      this.update.emit(updateObj);
    // }
  }

  updateEntry = (field: string, list: string[], index: number, newEntry: string) => {
    if (newEntry) {
      newEntry = newEntry.trim();
      if (newEntry) {
        const updateObj = {};
        updateObj[field] = [];
        for (let i = 0; i < list.length; i++) {
          if (i === index) {
            updateObj[field].push(newEntry);
          } else {
            updateObj[field].push(list[i]);
          }
        }
        this.update.emit(updateObj);
      }
    }
  }

  // editEntry = (field: string, list: string[], index: number) => {
  //   let newEntry = prompt(`Edit "${field}"`, list[index]);
  //   if (newEntry) {
  //     newEntry = newEntry.trim();
  //     if (newEntry) {
  //       const updateObj = {};
  //       updateObj[field] = [];
  //       for (let i = 0; i < list.length; i++) {
  //         if (i === index) {
  //           updateObj[field].push(newEntry);
  //         } else {
  //           updateObj[field].push(list[i]);
  //         }
  //       }
  //       this.update.emit(updateObj);
  //     }
  //   }
  // }

}
