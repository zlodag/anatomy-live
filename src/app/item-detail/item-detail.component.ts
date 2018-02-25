import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { DETAIL_FIELDS, PrintField } from '../models';
import { EditStateService } from '../edit-state.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/combineLatest';
import { firestore } from 'firebase';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css']
})
export class ItemDetailComponent implements OnInit {

  private itemDocument: AngularFirestoreDocument<any>;
  itemObservable: Observable<PrintField[]>;

  constructor(private readonly afs: AngularFirestore, public route: ActivatedRoute, public editState: EditStateService) { }

  ngOnInit() {
    this.itemDocument = this.afs.collection('users').doc(this.route.snapshot.paramMap.get('userId')).collection('/details').doc(this.route.snapshot.paramMap.get('itemId'));
    this.itemObservable = Observable.combineLatest(this.itemDocument.valueChanges(), this.editState.edit).map(([obj, edit]) => {
      const fields: PrintField[] = [];
      DETAIL_FIELDS.forEach(detailField => {
        if (obj && detailField.key in obj){
          fields.push({
            key: detailField.key,
            items: obj[detailField.key]
          });
        } else if (edit) {
          fields.push({
            key: detailField.key,
            items: []
          });
        }
      });
      return fields;
    });
  }

  update(updateObject: any) {
    // console.log('Updating: ' + JSON.stringify(updateObject));
    this.itemDocument.set(updateObject, { merge: true });
  }

  delete(field: string){
    // console.log('Deleting: ' + field);
    // this.itemDocument.delete();
    this.itemDocument.set({[field]: firestore.FieldValue.delete()}, { merge: true });
  }
}
