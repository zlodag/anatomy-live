import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { EditStateService } from '../edit-state.service';

@Component({
  selector: 'app-region-list',
  templateUrl: './region-list.component.html',
  styleUrls: ['./region-list.component.css']
})
export class RegionListComponent implements OnDestroy {

  private regionList = this.db.list(this.db.database.ref('regions').child(this.route.snapshot.paramMap.get('userId')), ref => ref.orderByKey());
  public regions = [];
  private sub = this.regionList.snapshotChanges().map(actions => actions.map(a => ({
    key: a.key,
    name: a.payload.val(),
  }))).subscribe(regions => {
    this.regions = regions;
  });
  
  constructor(public editState: EditStateService, public route: ActivatedRoute, private readonly db: AngularFireDatabase) { }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  add(newEntry: string) {
    this.regionList.push(newEntry);
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
