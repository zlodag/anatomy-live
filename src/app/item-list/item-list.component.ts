import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireAction } from 'angularfire2/database';
import { database, User } from 'firebase';
import { Observable } from 'rxjs/Observable';
import { EditStateService } from '../edit-state.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/first';

interface Item {
  key: string;
  name: string;
  copy: boolean;
}

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
})
export class ItemListComponent implements OnDestroy {
  
  constructor(private auth: AngularFireAuth, public editState: EditStateService, public route: ActivatedRoute, private readonly db: AngularFireDatabase) { }

  copying = false;
  copyEnabled = false;
  selectedRegion = "";
  newRegionName = this.route.snapshot.data.regionName;
  copyCount: number;
  private ownerId = this.route.snapshot.paramMap.get('userId');
  private regionId = this.route.snapshot.paramMap.get('regionId');
  private copySub = this.auth.authState.subscribe(user  => {
    this.copyEnabled = user && user.uid !== this.ownerId;
    this.selectedRegion = "";
  });
  private itemList = this.db.list(this.db.database.ref('items').child(this.ownerId).child(this.regionId), ref => ref.orderByValue());
  public items: Item[] = [];
  private sub = this.itemList.snapshotChanges().map(actions => actions.map(a => ({
    key: a.key,
    name: a.payload.val(),
    copy: true,
  }))).subscribe(items => {
    this.copyCount = items.length;
    this.items = items;
  });
  myRegions = this.auth.authState
    .switchMap<User, AngularFireAction<database.DataSnapshot>[]>(user => user ?
      this.db.list(this.db.database.ref('regions').child(user.uid)).snapshotChanges() :
      Observable.of([])
    )
    .map(action => action.map(a => ({
      key: a.key,
      name: a.payload.val(),
    })))
    .do(regions => {
      console.log('Just subscribed to regions', regions);
    });

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.copySub.unsubscribe();
  }

  add(newEntry: string) {
    this.itemList.push(newEntry);
  }

  update(itemKey: string, name: string) {
    this.itemList.set(itemKey, name);
  }

  delete(itemKey: string) {
    this.itemList.remove(itemKey).catch(error => {
      if (error.code === 'PERMISSION_DENIED') {
        alert('Item is not empty');
      }
    });
  }

  copyToExisting(regionKey: string) {
    this.auth.authState.first().subscribe(user => {
      if (user) {
        const rootRef = this.db.database.ref();
        const detailsRef = rootRef.child('details').child(this.ownerId).child(this.regionId);
        const imagesRef = rootRef.child('images').child(this.ownerId).child(this.regionId);
        this.items.filter(item => item.copy).forEach(item => 
          detailsRef.child(item.key).once('value', detailsSnap =>
           imagesRef.child(item.key).once('value', imagesSnap => {
              const newItemId = this.db.createPushId();
              const updateObj = {
                [`items/${user.uid}/${regionKey}/${newItemId}`]: item.name,
                [`details/${user.uid}/${regionKey}/${newItemId}`]: detailsSnap.val(),
                [`images/${user.uid}/${regionKey}/${newItemId}`]: imagesSnap.val(),
              };
              console.log(updateObj);
              rootRef.update(updateObj);
            })
          )
        );
      }
    });
  }

  copyToNew(regionName: string) {
    console.log(regionName);
    console.log(this.items.filter(item => item.copy));
  }

  // private getItemsToCopy() {
  //   return this.items.filter(item => item.copy);
  // }

  setCopy(item: Item, copy: boolean) {
    item.copy = copy;
    if (copy) {
      this.copyCount++;
    } else {
      this.copyCount--;
    }
  }

}
