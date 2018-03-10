import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { DETAIL_FIELDS } from '../models';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, DatabaseSnapshot } from 'angularfire2/database';
import 'rxjs/add/operator/first';

interface Node {
  key: string;
}

interface TextNode extends Node {
  text: string;
}

interface ImageNode extends Node {
  url: string;
  filename: string;
}

interface FieldNode extends Node {
  entries: TextNode[];
}

interface ItemNode extends TextNode {
  fields: FieldNode[];
  images: ImageNode[];
}

interface RegionNode extends TextNode {
  items: ItemNode[];
}

// interface FileReaderEventTarget extends EventTarget {
//   result: string;
// }

@Component({
  selector: 'app-backup',
  templateUrl: './backup.component.html',
})
export class BackupComponent implements OnInit {

  constructor(
    private readonly db: AngularFireDatabase,
    private auth: AngularFireAuth,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  // selectedFile: File = null;

  backupData: DatabaseSnapshot = this.route.snapshot.data.backupData;

  regions: RegionNode[];

  ngOnInit() {
    this.regions = [];
    if (this.backupData.exists) {
      this.backupData.child('regions').forEach(regionSnap => {
        const region: RegionNode = {
          key: regionSnap.key,
          text: regionSnap.val(),
          items: [],
        };
        this.backupData.child('items').child(regionSnap.key).forEach(itemSnap => {
          const detailsSnap = this.backupData.child('details').child(regionSnap.key).child(itemSnap.key);
          const item: ItemNode = {
            key: itemSnap.key,
            text: itemSnap.val(),
            fields: DETAIL_FIELDS
              .filter(detailField => detailsSnap.child('fields').hasChild(detailField.key))
              .map(detailField => {
                const fieldSnap = detailsSnap.child('fields').child(detailField.key);
                const field: FieldNode = {
                  key: fieldSnap.key,
                  entries: [],
                };
                fieldSnap.forEach(entrySnap => {
                  const entry: TextNode = {
                    key: entrySnap.key,
                    text: entrySnap.val(),
                  };
                  field.entries.push(entry);
                  return false;
                });
                return field;
              }),
            images: [],
          };
          detailsSnap.child('images').forEach(imageSnap => {
            const image: ImageNode = {
              key: imageSnap.key,
              url: imageSnap.child('url').val(),
              filename: imageSnap.child('filename').val(),
            };
            item.images.push(image);
            return false;
          });
          region.items.push(item);
          return false;
        });
        this.regions.push(region);
        return false;
      });
    }
  }

  restore() {
    if (confirm('Any existing data will be overwritten')) {
      this.auth.authState.first().subscribe(user => {
        if (user && user.uid === this.route.snapshot.paramMap.get('userId')) {
          this.db.database.ref().update({
            [`regions/${user.uid}`]: null,
            [`items/${user.uid}`]: null,
            [`details/${user.uid}`]: null,
          })
          .then(() => this.db.database.ref().update({
            [`regions/${user.uid}`]: this.backupData.child('regions').val(),
            [`items/${user.uid}`]: this.backupData.child('items').val(),
            [`details/${user.uid}`]: this.backupData.child('details').val(),
          }))
          .then(() => {
            alert('Successfully restored from backup file');
            this.router.navigate(['/', user.uid, 'regions']);
          })
          .catch(error => console.error(error.message));
        }
      });
    }
  }

  // fileSelected(files: FileList) {
  //   this.selectedFile = files.length ? files[0] : null;
  //   if (this.selectedFile) {
  //     const reader = new FileReader();
  //     reader.onload = event => {
  //       const json = (<FileReaderEventTarget>event.target).result;
  //       this.backup = JSON.parse(json);
  //       this.regions = [];
  //       for (let regionKey in this.backup.regions) {
  //         const region: RegionNode = {
  //           key: regionKey,
  //           text: this.backup.regions[regionKey],
  //           items: [],
  //         };
  //         for (let itemKey in this.backup.items[regionKey]) {
  //           const item: ItemNode = {
  //             key: itemKey,
  //             text: this.backup.items[regionKey][itemKey],
  //             details: [],
  //             images: [],
  //           };
  //           DETAIL_FIELDS.forEach(detailField => {
  //             if (detailField.key in this.backup.details[regionKey][itemKey]) {
  //               const field: FieldNode = {
  //                 key: detailField.key,
  //                 items: [],
  //               };
  //               for (let entryKey in this.backup.details[regionKey][itemKey][detailField.key]) {
  //                 const entry: TextNode = {
  //                   key: entryKey,
  //                   text: this.backup.details[regionKey][itemKey][detailField.key][entryKey],
  //                 };
  //                 field.items.push(entry);
  //               }
  //               item.details.push(field);
  //             }
  //           });
  //           for (let imageKey in this.backup.images[regionKey][itemKey]){
  //             const image: ImageNode = {
  //               key: imageKey,
  //               url: this.backup.images[regionKey][itemKey][imageKey].url,
  //               filename: this.backup.images[regionKey][itemKey][imageKey].filename,
  //             };
  //             item.images.push(image);
  //           }
  //           region.items.push(item);
  //         }
  //         this.regions.push(region);
  //       }
  //     };
  //     reader.readAsText(this.selectedFile);
  //   }
  // }

}
