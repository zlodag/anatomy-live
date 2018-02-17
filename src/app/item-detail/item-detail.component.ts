import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Details } from '../models';
import { EditStateService } from '../edit-state.service';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css']
})
export class ItemDetailComponent implements OnInit {

  private itemDocument: AngularFirestoreDocument<Details>;
  itemObservable: Observable<Details>;

  constructor(private readonly afs: AngularFirestore, public route: ActivatedRoute, public editState: EditStateService) { }

  ngOnInit() {
    this.itemDocument = this.afs.collection('/details').doc<Details>(this.route.snapshot.paramMap.get('itemId'));
    this.itemObservable = this.itemDocument.valueChanges().map(obj => obj || {});
  }

  addEntry = (field: string, list: string[] | void, newEntry: string) => {
    const updateObj = {};
    updateObj[field] = [];
    if (list) {
      for (let i = 0; i < list.length; ++i) {
        updateObj[field].push(list[i]);
      }
    }
    updateObj[field].push(newEntry);
    this.itemDocument.set(updateObj, { merge: true });
  }

  removeEntry = (field: string, list: string[], index: number) => {
    if (confirm(`Are you sure you want to remove "${list[index]}"?`)) {
      const updateObj = {};
      updateObj[field] = [];
      for (let i = 0; i < list.length; i++) {
        if (i !== index) {
          updateObj[field].push(list[i]);
        }
      }
      if (!updateObj[field].length) {
        updateObj[field] =  firebase.firestore.FieldValue.delete();
      }
      this.itemDocument.set(updateObj, { merge: true });
    }
  }

  editEntry = (field: string, list: string[], index: number) => {
    let newEntry = prompt(`Edit "${field}"`, list[index]);
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
        this.itemDocument.set(updateObj, { merge: true });
      }
    }
  }

}
