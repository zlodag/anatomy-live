import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';
import { EditStateService } from '../edit-state.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-region-list',
  templateUrl: './region-list.component.html',
  styleUrls: ['./region-list.component.css']
})
export class RegionListComponent implements OnInit, OnDestroy {


  private regionList = this.db.list(this.db.database.ref('regions').child(this.route.snapshot.paramMap.get('userId')), ref => ref.orderByKey());
  public regions = [];
  private sub = this.regionList.snapshotChanges().map(actions => actions.map(a => ({
    key: a.key,
    name: a.payload.val(),
  }))).subscribe(regions => {
    this.regions = regions;
  });
  
  constructor(public editState: EditStateService, public route: ActivatedRoute, private readonly db: AngularFireDatabase) { }

  ngOnInit() {
    // this.db.list()
    // this.userDoc = this.afs.collection('users').doc(this.route.snapshot.paramMap.get('userId'));
    // this.regionsCollection = this.userDoc.collection<Region>('/regions', ref => ref.orderBy('ts'));
    // this.regions = this.regionsCollection.snapshotChanges().map(actions => actions.map(a => a.payload.doc.id));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  add(newEntry: string) {
    this.regionList.push(newEntry);
    // this.regionList.
    // this.regionsCollection.doc<Region>(newEntry).set({
    //   ts: firebase.firestore.FieldValue.serverTimestamp(),
    // });
  }

  update(regionKey: string, name: string){
    this.regionList.set(regionKey, name);
  }

  delete(regionKey: string) {
    this.regionList.remove(regionKey).catch(error => {
      if (error.code == 'PERMISSION_DENIED') {
        alert('Region is not empty');
      }
    });
  }

}
