import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { EditStateService } from '../edit-state.service';
import * as firebase from 'firebase';
import 'rxjs/add/operator/first';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {

  // private itemsCollection: AngularFirestoreCollection<Item>;

  // items: Observable<string[]>;

  // constructor(private readonly afs: AngularFirestore, private router: Router, public route: ActivatedRoute) { }
  constructor(public route: ActivatedRoute, public editState: EditStateService, private readonly afs: AngularFirestore) { }

  ngOnInit() {
    // this.itemsCollection = this.afs.collection<Item>('/items', ref => ref.where('region', '==', this.route.snapshot.paramMap.get('regionId')));
    // this.items = this.itemsCollection.snapshotChanges().map(actions => actions.map(a => a.payload.doc.id));
  }

  newItem = (newEntry : string) => {
    this.route.paramMap.first().subscribe(params => {
      this.afs.collection('/items').doc(newEntry).set({
        ts: firebase.firestore.FieldValue.serverTimestamp(),
        region: params.get('regionId')
      })
    });
  }
}
