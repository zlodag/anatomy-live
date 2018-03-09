import { Component, OnDestroy } from '@angular/core';
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
export class ItemListComponent implements OnDestroy {
  
  constructor(private auth: AngularFireAuth, public ownerService: OwnerService, public route: ActivatedRoute, private readonly db: AngularFireDatabase) { }

  copying = false;
  private ownerId = this.route.snapshot.paramMap.get('userId');
  private regionId = this.route.snapshot.paramMap.get('regionId');
  
  items: Item[] = [];
  copyCount: number;
  private itemsList = this.db.list(this.db.database.ref('items').child(this.ownerId).child(this.regionId), ref => ref.orderByValue());
  private itemsSub = this.itemsList.snapshotChanges()
    .subscribe(actions => {
      this.items = actions.map(a => ({
        key: a.key,
        name: a.payload.val(),
        copy: true,
      }));
      this.copyCount = this.items.length;
    });

  myRegions: Region[] = [];
  selectedRegion = "";
  newRegionName = this.route.snapshot.data.regionName;
  private regionsSub = this.auth.authState
    .switchMap<User, AngularFireAction<database.DataSnapshot>[]>(user => user ?
      this.db.list(this.db.database.ref('regions').child(user.uid)).snapshotChanges() :
      Observable.of([])
    )
    .subscribe(action => {
      this.myRegions = action.map(a => ({
        key: a.key,
        name: a.payload.val(),
      }));
      this.selectedRegion = "";
    });

  ngOnDestroy() {
    this.itemsSub.unsubscribe();
    this.regionsSub.unsubscribe();
  }

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

  private _copyToExisting(userId: string, regionKey: string) {
    const rootRef = this.db.database.ref();
    const detailsRef = rootRef.child('details').child(this.ownerId).child(this.regionId);
    const imagesRef = rootRef.child('images').child(this.ownerId).child(this.regionId);
    this.items.filter(item => item.copy).forEach(item => 
      detailsRef.child(item.key).once('value', detailsSnap =>
       imagesRef.child(item.key).once('value', imagesSnap => {
          const newItemId = this.db.createPushId();
          const updateObj = {[`items/${userId}/${regionKey}/${newItemId}`]: item.name};
          if (detailsSnap.exists()) {
            updateObj[`details/${userId}/${regionKey}/${newItemId}`] = detailsSnap.val();
          }
          if (imagesSnap.exists()) {
            updateObj[`images/${userId}/${regionKey}/${newItemId}`] = imagesSnap.val();
          }
          rootRef.update(updateObj);
        })
      )
    );
    this.copying = false;
  }

  copyToExisting(regionKey: string) {
    this.auth.authState.first().subscribe(user => {
      if (user) {
        this._copyToExisting(user.uid, regionKey);
      }
    });
  }

  copyToNew(regionName: string) {
    this.auth.authState.first().subscribe(user => {
      if (user) {
        const ref = this.db.database.ref('regions').child(user.uid).push();
        ref.set(regionName, (error: FirebaseError) => {
          if (error) {
            if (error.code === 'PERMISSION_DENIED'){
              alert('Set your profile name first');
            } else {
              console.error(error.message);
            }
          } else {
            this._copyToExisting(user.uid, ref.key);
          }
        });
      }
    });
  }

}
