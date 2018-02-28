import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { DETAIL_FIELDS, PrintField } from '../models';
import { EditStateService } from '../edit-state.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/combineLatest';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css']
})
export class ItemDetailComponent implements OnInit {

  private itemRef = this.db.database.ref('details').child(this.route.snapshot.paramMap.get('userId')).child(this.route.snapshot.paramMap.get('regionId')).child(this.route.snapshot.paramMap.get('itemId'));
  
  itemObservable: Observable<PrintField[]> = Observable.combineLatest(this.db.object(this.itemRef).snapshotChanges(), this.editState.edit).map(([action, edit]) => {
      const fields: PrintField[] = [];
      DETAIL_FIELDS.forEach(detailField => {
        if (action.payload.hasChild(detailField.key) || edit) {
          const field: PrintField = {
            key: detailField.key,
            entries: []
          };
          action.payload.child(detailField.key).forEach(snap => {
            field.entries.push({
              key: snap.key,
              name: snap.val()
            });
            return false;
          });
          fields.push(field);
        }
      });
      return fields;
    });

  // items = this.itemList.snapshotChanges().map(actions => actions.map(a => ({
  //   key: a.key,
  //   name: a.payload.val(),
  // })));

  // private itemDocument: AngularFirestoreDocument<any>;
  // itemObservable: Observable<PrintField[]>;

  constructor(private readonly db: AngularFireDatabase, public route: ActivatedRoute, public editState: EditStateService) { }

  ngOnInit() {
    // this.itemDocument = this.afs.collection('users').doc(this.route.snapshot.paramMap.get('userId')).collection('/details').doc(this.route.snapshot.paramMap.get('itemId'));
    // this.itemObservable = Observable.combineLatest(this.itemDocument.valueChanges(), this.editState.edit).map(([obj, edit]) => {
    //   const fields: PrintField[] = [];
    //   DETAIL_FIELDS.forEach(detailField => {
    //     if (obj && detailField.key in obj){
    //       fields.push({
    //         key: detailField.key,
    //         items: obj[detailField.key]
    //       });
    //     } else if (edit) {
    //       fields.push({
    //         key: detailField.key,
    //         items: []
    //       });
    //     }
    //   });
    //   return fields;
    // });
  }

  add(field: string, entry: string) {
    this.itemRef.child(field).push(entry);
  }

  set(field: string, entryKey: string, entry: string) {
    // console.log('Updating: ' + JSON.stringify(updateObject));
    this.itemRef.child(field).child(entryKey).set(entry);
    // this.itemDocument.set(updateObject, { merge: true });
  }

  remove(field: string, entryKey: string){
    // console.log('Deleting: ' + field);
    // this.itemDocument.delete();
    this.itemRef.child(field).child(entryKey).remove();
    // this.itemDocument.set({[field]: firestore.FieldValue.delete()}, { merge: true });
  }
}
