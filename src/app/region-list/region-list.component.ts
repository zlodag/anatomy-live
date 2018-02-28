import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
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

  
  private regionList = this.db.list(this.db.database.ref('regions').child(this.route.snapshot.paramMap.get('userId')), ref => ref.orderByKey());
  
  regions = this.regionList.snapshotChanges().map(actions => actions.map(a => ({
    key: a.key,
    name: a.payload.val(),
  })));
  
  constructor(public editState: EditStateService, public route: ActivatedRoute, private readonly db: AngularFireDatabase) { }

  ngOnInit() {
    // this.db.list()
    // this.userDoc = this.afs.collection('users').doc(this.route.snapshot.paramMap.get('userId'));
    // this.regionsCollection = this.userDoc.collection<Region>('/regions', ref => ref.orderBy('ts'));
    // this.regions = this.regionsCollection.snapshotChanges().map(actions => actions.map(a => a.payload.doc.id));
  }

  newRegion(newEntry: string) {
    this.regionList.push(newEntry);
    // this.regionList.
    // this.regionsCollection.doc<Region>(newEntry).set({
    //   ts: firebase.firestore.FieldValue.serverTimestamp(),
    // });
  }

  deleteRegion(regionId: string) {
    this.regionList.remove(regionId).catch(error => {
      if (error.code == 'PERMISSION_DENIED') {
        alert('Region is not empty');
      }
    });
  }

}
