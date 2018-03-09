import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';
import { DETAIL_FIELDS, Field } from '../models';
import { OwnerService } from '../owner.service';
import 'rxjs/add/operator/map';
import { storage, FirebaseError } from 'firebase';

interface Image {
  key: string;
  url: string;
  filename: string;
}

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
})
export class ItemDetailComponent {

  constructor(
    private readonly db: AngularFireDatabase,
    private storage: AngularFireStorage,
    public route: ActivatedRoute,
    public ownerService: OwnerService,
  ) { }

  private userId = this.route.snapshot.paramMap.get('userId');
  private regionId = this.route.snapshot.paramMap.get('regionId');
  private itemId = this.route.snapshot.paramMap.get('itemId');
  private itemRef = this.db.database.ref('details')
    .child(this.userId)
    .child(this.regionId)
    .child(this.itemId);
  private imageParentRef = this.db.database.ref('images')
    .child(this.userId)
    .child(this.regionId)
    .child(this.itemId);

  detailFields = DETAIL_FIELDS;
  selectedField = '';
  selectedFile: File = null;

  images: Observable<Image[]> = this.db.list(this.imageParentRef, ref => ref.orderByKey())
    .snapshotChanges()
    .map(action => action.map(a => ({
      key: a.key,
      url: a.payload.child('url').val(),
      filename: a.payload.child('filename').val()
    })));
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

  add(field: string, entry: string) {
    this.itemRef.child(field).push(entry);
  }

  set(field: string, entryKey: string, entry: string) {
    this.itemRef.child(field).child(entryKey).set(entry);
  }

  remove(field: string, entryKey: string) {
    this.itemRef.child(field).child(entryKey).remove();
  }

  fileSelected(files: FileList) {
    this.selectedFile = files.length ? files[0] : null;
  }

  uploadFile() {
    const file = this.selectedFile;
    if (file) {
      this.storage.storage
        .ref(this.userId)
        .child(this.regionId)
        .child(this.itemId)
        .child(file.name)
        .put(file, {cacheControl: 'max-age=31536000'})
        .then(snap => {
          if (snap.state === storage.TaskState.SUCCESS) {
            this.imageParentRef.push({
              filename: file.name,
              url: snap.downloadURL
            });
          }
        });
      this.selectedFile = null;
    }
  }

  removeImage(image: Image) {
    this.imageParentRef.child(image.key).remove()
      .then(() => this.storage.storage.refFromURL(image.url).delete())
      .catch((error: FirebaseError) => {
        if (error.code === 'storage/unauthorized') {
          console.info(error.message);
        } else {
          console.error(error.message);
        }
      });
  }

}
