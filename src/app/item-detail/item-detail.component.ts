import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { DETAIL_FIELDS, Field } from '../models';
import { EditStateService } from '../edit-state.service';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css']
})
export class ItemDetailComponent implements OnInit {

  private itemRef = this.db.database.ref('details')
    .child(this.route.snapshot.paramMap.get('userId'))
    .child(this.route.snapshot.paramMap.get('regionId'))
    .child(this.route.snapshot.paramMap.get('itemId'));
  
  fields: Observable<Field[]> = this.db.object(this.itemRef).snapshotChanges().map(action => {
      const fields: Field[] = [];
      DETAIL_FIELDS.forEach(detailField => {
        if (action.payload.hasChild(detailField.key)) {
          const field: Field = {
            key: detailField.key,
            entries: []
          };
          action.payload.child(detailField.key).forEach(snap => {
            field.entries.push({
              key: snap.key,
              text: snap.val()
            });
            return false;
          });
          fields.push(field);
        }
      });
      return fields;
    });

  constructor(private readonly db: AngularFireDatabase, public route: ActivatedRoute, public editState: EditStateService) { }

  ngOnInit() {
  }

  add(field: string, entry: string) {
    this.itemRef.child(field).push(entry);
  }

  set(field: string, entryKey: string, entry: string) {
    this.itemRef.child(field).child(entryKey).set(entry);
  }

  remove(field: string, entryKey: string){
    this.itemRef.child(field).child(entryKey).remove();
  }
}
