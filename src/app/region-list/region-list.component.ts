import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Region } from '../models';
import * as firebase from 'firebase';
import { EditStateService } from '../edit-state.service';

@Component({
  selector: 'app-region-list',
  templateUrl: './region-list.component.html',
  styleUrls: ['./region-list.component.css']
})
export class RegionListComponent implements OnInit {

  private userDoc: AngularFirestoreDocument<any>;
  private regionsCollection: AngularFirestoreCollection<Region>;
  regions: Observable<string[]>;

  constructor(public editState: EditStateService, public route: ActivatedRoute, private readonly afs: AngularFirestore) { }

  ngOnInit() {
    this.userDoc = this.afs.collection('users').doc(this.route.snapshot.paramMap.get('userId'));
    this.regionsCollection = this.userDoc.collection<Region>('/regions', ref => ref.orderBy('ts'));
    this.regions = this.regionsCollection.snapshotChanges().map(actions => actions.map(a => a.payload.doc.id));
  }

  newRegion = (newEntry: string) => {
    this.regionsCollection.doc<Region>(newEntry).set({
      ts: firebase.firestore.FieldValue.serverTimestamp(),
    });
  }

  deleteRegion(region: string) {
    this.userDoc.collection('items').ref.where('region', '==', region).get()
    .then(querySnapshot => {
      if (querySnapshot.size) {
        alert(`"${region}" is not empty`);
      } else {
        this.regionsCollection.doc(region).delete();
      }
    });
  }

}
