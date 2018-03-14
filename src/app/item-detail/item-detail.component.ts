import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';
import { DETAIL_FIELDS, Field, Entry } from '../models';
import { OwnerService } from '../owner.service';
import 'rxjs/add/operator/map';
import { storage as fBstorage, FirebaseError } from 'firebase';

interface Image {
  key: string;
  url: string;
  filename: string;
}

interface Details {
  fields: Field[];
  images: Image[];
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

  private detailsRef = this.db.database.ref('details')
    .child(this.userId)
    .child(this.regionId)
    .child(this.itemId);

  detailFields = DETAIL_FIELDS;

  selectedField = '';

  selectedFile: File = null;

  details: Observable<Details> = this.db.object(this.detailsRef)
    .snapshotChanges()
    .map(action => {
      const fieldsSnap = action.payload.child('fields');
      const fields: Field[] = DETAIL_FIELDS
          .filter(detailField => fieldsSnap.hasChild(detailField.key))
          .map(detailField => {
            const field: Field = {
              key: detailField.key,
              entries: [],
            };
            fieldsSnap.child(detailField.key).forEach(snap => {
              field.entries.push({
                key: snap.key,
                text: snap.val()
              });
              return false;
            });
            return field;
          });
        const images: Image[] = [];
        action.payload.child('images').forEach(snap => {
          images.push({
            key: snap.key,
            url: snap.child('url').val(),
            filename: snap.child('filename').val()
          });
          return false;
        });
        return {
          fields: fields,
          images: images,
        };
      });

  add(field: string, entry: string) {
    this.detailsRef.child('fields').child(field).push(entry);
  }

  set(field: string, entryKey: string, entry: string) {
    this.detailsRef.child('fields').child(field).child(entryKey).set(entry);
  }

  remove(field: string, entryKey: string) {
    this.detailsRef.child('fields').child(field).child(entryKey).remove();
  }

  swap(field: string, entry1: Entry, entry2: Entry) {
    this.detailsRef.child('fields').child(field).update({
      [entry1.key]: entry2.text,
      [entry2.key]: entry1.text,
    });
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
          if (snap.state === fBstorage.TaskState.SUCCESS) {
            this.detailsRef.child('images').push({
              filename: file.name,
              url: snap.downloadURL
            });
          }
        });
      this.selectedFile = null;
    }
  }

  removeImage(image: Image) {
    this.detailsRef.child('images').child(image.key).remove()
      .then(() => this.storage.storage.refFromURL(image.url).delete())
      .catch((error: FirebaseError) => {
        if (error.code === 'storage/unauthorized') {
          console.log(error.message);
        } else {
          console.error(error.message);
        }
      });
  }

}
