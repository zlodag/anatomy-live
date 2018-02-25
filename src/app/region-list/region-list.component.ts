import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Region } from '../models';
// import 'rxjs/add/operator/first';
import * as firebase from 'firebase';
import { EditStateService } from '../edit-state.service';

@Component({
  selector: 'app-region-list',
  templateUrl: './region-list.component.html',
  styleUrls: ['./region-list.component.css']
})
export class RegionListComponent implements OnInit {

  private regionsCollection: AngularFirestoreCollection<Region>;
  regions: Observable<string[]>;

  constructor(public editState: EditStateService, public route: ActivatedRoute, private readonly afs: AngularFirestore) { }

  ngOnInit() {
    this.regionsCollection = this.afs.collection('users').doc(this.route.snapshot.paramMap.get('userId')).collection<Region>('/regions', ref => ref.orderBy('ts'));
    this.regions = this.regionsCollection.snapshotChanges().map(actions => actions.map(a => a.payload.doc.id));
  }

  newRegion = (newEntry: string) => {
    this.regionsCollection.doc<Region>(newEntry).set({
      ts: firebase.firestore.FieldValue.serverTimestamp(),
    });
  }

}
