import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Region } from '../models';

interface RegionWithId extends Region {
	id: string;
}
@Component({
  selector: 'app-region-list',
  templateUrl: './region-list.component.html',
  styleUrls: ['./region-list.component.css']
})
export class RegionListComponent implements OnInit {

  private regionsCollection: AngularFirestoreCollection<Region>;

  regions: Observable<Region[]>;

  constructor(private readonly afs: AngularFirestore, private router: Router) {
  }

  ngOnInit() {
    this.regionsCollection = this.afs.collection<Region>('/regions', ref => ref.orderBy('name'));
    this.regions = this.regionsCollection.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Region;
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    });
  }

}
