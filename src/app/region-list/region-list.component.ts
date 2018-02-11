import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
// import { Observable } from 'rxjs/Observable';
// import { Region } from '../models';

// interface RegionWithId extends Region {
// 	id: string;
// }
@Component({
  selector: 'app-region-list',
  templateUrl: './region-list.component.html',
  styleUrls: ['./region-list.component.css']
})
export class RegionListComponent implements OnInit {

  // private regionsCollection: AngularFirestoreCollection<Region>;

  // regions: Observable<Region[]>;
  // regions: Observable<string[]>;

  constructor(public route: ActivatedRoute) { }

  ngOnInit() {
    // this.regionsCollection = this.afs.collection<Region>('/regions', ref => ref.orderBy('ts'));
    // this.regions = this.regionsCollection.snapshotChanges().map(actions => actions.map(a => a.payload.doc.id));
  }

}
