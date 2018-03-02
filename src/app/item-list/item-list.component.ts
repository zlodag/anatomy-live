import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { EditStateService } from '../edit-state.service';
// import {  } from '../models';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html'
})
export class ItemListComponent implements OnInit {

  private itemList = this.db.list(this.db.database.ref('items').child(this.route.snapshot.paramMap.get('userId')).child(this.route.snapshot.paramMap.get('regionId')), ref => ref.orderByKey());
  
  items = this.itemList.snapshotChanges().map(actions => actions.map(a => ({
    key: a.key,
    name: a.payload.val(),
  })));

  constructor(public route: ActivatedRoute, public editState: EditStateService, private readonly db: AngularFireDatabase) { }

  ngOnInit() {
  }

  newItem(newEntry: string) {
    this.itemList.push(newEntry);
  }

  deleteItem(itemId: string) {
    this.itemList.remove(itemId).catch(error => {
      if (error.code == 'PERMISSION_DENIED') {
        alert('Item is not empty');
      }
    });
  }
}
