import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { OwnerService } from '../owner.service';
import { database } from 'firebase';

@Component({
  selector: 'app-region-list',
  templateUrl: './region-list.component.html',
})
export class RegionListComponent {

  constructor(public ownerService: OwnerService, private route: ActivatedRoute, private readonly db: AngularFireDatabase) { }

  private regionList = this.db.list(
    this.db.database.ref('regions').child(this.route.snapshot.paramMap.get('userId')),
    ref => ref.orderByChild('timestamp')
  );

  regions = this.regionList.snapshotChanges()
    .map(actions => actions.map(a => ({
      key: a.key,
      name: a.payload.child('name').val(),
      timestamp: a.payload.child('timestamp').val(),
    })));

  add(newEntry: string) {
    this.regionList.push({
      name: newEntry,
      timestamp: database.ServerValue.TIMESTAMP,
    });
  }

  update(regionKey: string, name: string) {
    this.regionList.query.ref.child(regionKey).child('name').set(name);
  }

  delete(regionKey: string) {
    this.regionList.remove(regionKey).catch(error => {
      if (error.code === 'PERMISSION_DENIED') {
        alert('Region is not empty');
      }
    });
  }

}
