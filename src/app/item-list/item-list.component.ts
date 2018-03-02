import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { EditStateService } from '../edit-state.service';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html'
})
export class ItemListComponent implements OnDestroy {

  private itemList = this.db.list(this.db.database.ref('items').child(this.route.snapshot.paramMap.get('userId')).child(this.route.snapshot.paramMap.get('regionId')), ref => ref.orderByKey());
  public items = [];
  private sub = this.itemList.snapshotChanges().map(actions => actions.map(a => ({
    key: a.key,
    name: a.payload.val(),
  }))).subscribe(items => {
    this.items = items;
  });
  
  constructor(public editState: EditStateService, public route: ActivatedRoute, private readonly db: AngularFireDatabase) { }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  add(newEntry: string) {
    this.itemList.push(newEntry);
  }

  update(itemKey: string, name: string){
    this.itemList.set(itemKey, name);
  }

  delete(itemKey: string) {
    this.itemList.remove(itemKey).catch(error => {
      if (error.code == 'PERMISSION_DENIED') {
        alert('Item is not empty');
      }
    });
  }

}
