import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireAction } from 'angularfire2/database';
import { database, User, FirebaseError } from 'firebase';
import { Observable } from 'rxjs/Observable';
import { OwnerService } from '../owner.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/first';

interface Item {
  key: string;
  name: string;
  copy: boolean;
}

interface Region {
  key: string;
  name: string;
}

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
})
export class ItemListComponent {

  constructor(
    private auth: AngularFireAuth,
    public ownerService: OwnerService,
    public route: ActivatedRoute,
    private readonly db: AngularFireDatabase
  ) { }

  copying = false;

  private ownerId = this.route.snapshot.paramMap.get('userId');

  private regionId = this.route.snapshot.paramMap.get('regionId');

  copyCount: number;

  private itemsList = this.db.list(this.db.database.ref('items').child(this.ownerId).child(this.regionId), ref => ref.orderByValue());

  items: Observable<Item[]> = this.itemsList.snapshotChanges()
    .map(actions => actions.map(a => ({
        key: a.key,
        name: a.payload.val(),
        copy: true,
      })))
    .do(items => this.copyCount = items.length);

  newRegionName = this.route.snapshot.data.regionName;

  selectedRegionKey = '';

  myRegions: Observable<Region[]> = this.auth.authState
    .switchMap<User, AngularFireAction<database.DataSnapshot>[]>(user => user ?
      this.db.list(this.db.database.ref('regions').child(user.uid)).snapshotChanges() :
      Observable.of([]))
    .map(action => action.map(a => ({
        key: a.key,
        name: a.payload.val(),
      })))
    .do(regions => this.selectedRegionKey = '');

  add(newEntry: string) {
    this.itemsList.push(newEntry);
  }

  update(itemKey: string, name: string) {
    this.itemsList.set(itemKey, name);
  }

  delete(itemKey: string) {
    this.itemsList.remove(itemKey).catch(error => {
      if (error.code === 'PERMISSION_DENIED') {
        alert('Item is not empty');
      }
    });
  }

  setCopy(item: Item, copy: boolean) {
    item.copy = copy;
    if (copy) {
      this.copyCount++;
    } else {
      this.copyCount--;
    }
  }

  private _copyToExisting(allItems: Item[], userId: string, regionKey: string) {
    const rootRef = this.db.database.ref();
    const detailsRef = rootRef.child('details').child(this.ownerId).child(this.regionId);
    allItems.filter(item => item.copy).forEach(item =>
      detailsRef.child(item.key).once('value', detailsSnap => {
        const newItemId = this.db.createPushId();
        const updateObj = {[`items/${userId}/${regionKey}/${newItemId}`]: item.name};
        if (detailsSnap.exists()) {
          updateObj[`details/${userId}/${regionKey}/${newItemId}`] = detailsSnap.val();
        }
        rootRef.update(updateObj);
      })
    );
    this.copying = false;
  }

  copyToExisting(allItems: Item[], regionKey: string) {
    this.auth.authState.first().subscribe(user => {
      if (user) {
        this._copyToExisting(allItems, user.uid, regionKey);
      }
    });
  }

  copyToNew(allItems: Item[], regionName: string) {
    this.auth.authState.first().subscribe(user => {
      if (user) {
        const ref = this.db.database.ref('regions').child(user.uid).push();
        ref.set(regionName, (error: FirebaseError) => {
          if (error) {
            if (error.code === 'PERMISSION_DENIED') {
              alert('Set your profile name first');
            } else {
              console.error(error.message);
            }
          } else {
            this._copyToExisting(allItems, user.uid, ref.key);
          }
        });
      }
    });
  }

}
