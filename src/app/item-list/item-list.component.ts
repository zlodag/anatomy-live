import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { EditStateService } from '../edit-state.service';
import { Item } from '../models';
import * as firebase from 'firebase';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html'
})
export class ItemListComponent implements OnInit {

  private itemsCollection: AngularFirestoreCollection<Item>;
  items: Observable<string[]>;

  constructor(public route: ActivatedRoute, public editState: EditStateService, private readonly afs: AngularFirestore) { }

  ngOnInit() {
    this.itemsCollection = this.afs.collection('users').doc(this.route.snapshot.paramMap.get('userId')).collection<Item>('/items', ref =>
      ref.where('region', '==', this.route.snapshot.paramMap.get('regionId'))
    );
    this.items = this.itemsCollection.snapshotChanges().map(actions => actions.map(a => a.payload.doc.id));
  }

  newItem = (newEntry: string) => {
    this.itemsCollection.doc<Item>(newEntry).set({
      ts: firebase.firestore.FieldValue.serverTimestamp(),
      region: this.route.snapshot.paramMap.get('regionId')
    });
  }
}
