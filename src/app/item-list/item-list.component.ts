import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { EditStateService } from '../edit-state.service';
import { Item } from '../models';
import * as firebase from 'firebase';
import { firestore } from 'firebase';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html'
})
export class ItemListComponent implements OnInit {

  private itemsCollection: AngularFirestoreCollection<Item>;
  private userDoc: AngularFirestoreDocument<any>;
  items: Observable<string[]>;

  constructor(public route: ActivatedRoute, public editState: EditStateService, private readonly afs: AngularFirestore) { }

  ngOnInit() {
    this.userDoc = this.afs.collection('users').doc(this.route.snapshot.paramMap.get('userId'));
    this.itemsCollection = this.userDoc.collection<Item>('items', ref =>
      ref.where('region', '==', this.route.snapshot.paramMap.get('regionId'))
    );
    this.items = this.itemsCollection.snapshotChanges().map(actions => actions.map(a => a.payload.doc.id));
  }

  newItem(newEntry: string) {
    this.itemsCollection.doc<Item>(newEntry).set({
      ts: firestore.FieldValue.serverTimestamp(),
      region: this.route.snapshot.paramMap.get('regionId')
    })
    .then(() => {
      this.userDoc.collection('details').doc(newEntry).set({}, {merge: true});
    });
  }

  deleteItem(item: string) {
    this.userDoc.collection('details').doc(item).delete()
    .then(
      () => this.itemsCollection.doc(item).delete(),
      (error : firestore.FirestoreError) => {
        if (error.code === 'permission-denied') {
          alert(`"${item}" is not empty`);
        } else {
          console.error(error.message);          
        }
      }
    );
  }
}
