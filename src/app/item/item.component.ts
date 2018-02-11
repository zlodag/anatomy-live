import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Details, DETAIL_FIELDS } from '../models';
import { EditStateService } from '../edit-state.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import * as firebase from 'firebase';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css'],
})
export class ItemComponent implements OnInit {

  itemDocObservable: Observable<AngularFirestoreDocument<Details>>;
  itemObservable: Observable<Details>;
  DETAIL_FIELDS = DETAIL_FIELDS;

  constructor(private readonly afs: AngularFirestore, public route: ActivatedRoute, public editState: EditStateService) { }

  ngOnInit() {
  	this.itemDocObservable = this.route.paramMap.map(params => this.afs.collection('/details').doc<Details>(params.get('itemId')));
  	this.itemObservable = this.itemDocObservable.switchMap(doc => doc.valueChanges()).map(obj => obj || {});
  }

  addEntry = (field : string, list: string[] | void, newEntry: string) => {
    let updateObj = {};
    updateObj[field] = [];
    if (list) {
      for (var i = 0; i < list.length; ++i) {
        updateObj[field].push(list[i]);
      }
    }
    updateObj[field].push(newEntry);
    this.itemDocObservable.first().subscribe(doc => doc.set(updateObj, { merge: true }));
  };

  removeEntry = (field : string, list: string[], index: number) => {
    if (confirm(`Are you sure you want to remove "${list[index]}"?`)) {
      let updateObj = {};
      updateObj[field] = [];
      for (var i = 0; i < list.length; i++) {
        if (i != index) updateObj[field].push(list[i]);
      }
      if (!updateObj[field].length) {
        updateObj[field] =  firebase.firestore.FieldValue.delete();
      }
      this.itemDocObservable.first().subscribe(doc => doc.set(updateObj, { merge: true }));
    }
  };

  editEntry = (field : string, list: string[], index: number) => {
    let newEntry = prompt(`Edit "${field}"`, list[index]);
    if (newEntry) {
      newEntry = newEntry.trim();
      if (newEntry) {
        let updateObj = {};
        updateObj[field] = [];
        for (var i = 0; i < list.length; i++) {
          if (i == index) updateObj[field].push(newEntry);
          else updateObj[field].push(list[i]);
        }
        this.itemDocObservable.first().subscribe(doc => doc.set(updateObj, { merge: true }));
      }
    }
  };

}
