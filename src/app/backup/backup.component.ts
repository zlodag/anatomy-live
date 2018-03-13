import { Component, Input } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { DETAIL_FIELDS, RestoreObject } from '../models';
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

interface TimestampTextNode extends TextNode {
  timestamp: number;
}

interface ImageNode extends Node {
  url: string;
  filename: string;
}

interface FieldNode extends Node {
  entries: TextNode[];
}

interface ItemNode extends TimestampTextNode {
  fields: FieldNode[];
  images: ImageNode[];
}

interface RegionNode extends TimestampTextNode {
  items: ItemNode[];
}

interface FileReaderEventTarget extends EventTarget {
  result: string;
}

function sortByKey(a: Node, b: Node): number {
  return a.key > b.key ? 1 : a.key < b.key ? -1 : 0;
}
function sortByTimestamp(a: TimestampTextNode, b: TimestampTextNode): number {
  return a.timestamp - b.timestamp;
}

@Component({
  selector: 'app-backup',
  templateUrl: './backup.component.html',
})
export class BackupComponent {

  constructor(
    private readonly db: AngularFireDatabase,
    private auth: AngularFireAuth,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  @Input() title: string;
  @Input() regions: RegionNode[];
  @Input() restoreObject: RestoreObject;

  restore() {
    if (this.restoreObject && confirm('Any existing data will be overwritten')) {
      this.auth.authState.first().subscribe(user => {
        if (user && user.uid === this.route.snapshot.paramMap.get('userId')) {
          this.db.database.ref().update({
            [`regions/${user.uid}`]: null,
            [`items/${user.uid}`]: null,
            [`details/${user.uid}`]: null,
          })
          .then(() => this.db.database.ref().update({
              [`regions/${user.uid}`]: this.restoreObject.regions,
              [`items/${user.uid}`]: this.restoreObject.items,
              [`details/${user.uid}`]: this.restoreObject.details,
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

}

@Component({
  templateUrl: './server-backup.component.html',
})
export class ServerBackupComponent {

  constructor(private route: ActivatedRoute) { }

  private backupData: DatabaseSnapshot = this.route.snapshot.data.serverBackup;
  timestamp = this.backupData.child('timestamp').val();
  regions: RegionNode[] = fromSnap(this.backupData);
  restoreObject: RestoreObject = {
    regions: this.backupData.child('regions').val(),
    items: this.backupData.child('items').val(),
    details: this.backupData.child('details').val(),
  };
}

@Component({
  templateUrl: './file-backup.component.html',
})
export class FileBackupComponent {

  regions: RegionNode[];

  restoreObject: RestoreObject;

  fileSelected(files: FileList) {
    if (files.length) {
      const reader = new FileReader();
      reader.onload = event => {
        const json = (<FileReaderEventTarget>event.target).result;
        this.restoreObject = JSON.parse(json);
        this.regions = fromParsed(this.restoreObject);
      };
      reader.readAsText(files[0]);
    }
  }

}

function fromSnap(dataSnap: DatabaseSnapshot): RegionNode[] {
  const regions: RegionNode[] = [];
  if (dataSnap.exists) {
    dataSnap.child('regions').forEach(regionSnap => {
      const region: RegionNode = {
        key: regionSnap.key,
        text: regionSnap.child('name').val(),
        timestamp: regionSnap.child('timestamp').val(),
        items: [],
      };
      dataSnap.child('items').child(regionSnap.key).forEach(itemSnap => {
        const detailsSnap = dataSnap.child('details').child(regionSnap.key).child(itemSnap.key);
        const item: ItemNode = {
          key: itemSnap.key,
          text: itemSnap.child('name').val(),
          timestamp: itemSnap.child('timestamp').val(),
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
      region.items = region.items.sort(sortByTimestamp);
      regions.push(region);
      return false;
    });
    return regions.sort(sortByTimestamp);
  }
}

function fromParsed(data: RestoreObject): RegionNode[] {
  let regions: RegionNode[] = [];
  if (data.regions) {
    Object.keys(data.regions).forEach(regionKey => {
      const region: RegionNode = {
        key: regionKey,
        text: data.regions[regionKey].name,
        timestamp: data.regions[regionKey].timestamp,
        items: [],
      };
      if (data.items && regionKey in data.items) {
        Object.keys(data.items[regionKey]).forEach(itemKey => {
          const itemObj = data.items[regionKey][itemKey];
          const item: ItemNode = {
            key: itemKey,
            text: itemObj.name,
            timestamp: itemObj.timestamp,
            fields: [],
            images: [],
          };
          if (data.details && regionKey in data.details && itemKey in data.details[regionKey]) {
            const detailsObj = data.details[regionKey][itemKey];
            if (detailsObj.fields) {
              for (let i = 0; i < DETAIL_FIELDS.length; i++) {
                const detailFieldKey = DETAIL_FIELDS[i].key;
                if (detailFieldKey in detailsObj.fields) {
                  const fieldObj = detailsObj.fields[detailFieldKey];
                  const field: FieldNode = {
                    key: detailFieldKey,
                    entries: [],
                  };
                  Object.keys(fieldObj).forEach(entryKey => {
                    field.entries.push({
                      key: entryKey,
                      text: fieldObj[entryKey],
                    });
                  });
                  field.entries.sort(sortByKey);
                  item.fields.push(field);
                }
              }
            }
            if (detailsObj.images) {
              Object.keys(detailsObj.images).forEach(imageKey => {
                const imageObj = detailsObj.images[imageKey];
                item.images.push({
                  key: imageKey,
                  url: imageObj.url,
                  filename: imageObj.filename,
                });
              });
              item.images.sort(sortByKey);
            }
          }
          region.items.push(item);
        });
        region.items = region.items.sort(sortByTimestamp);
      }
      regions.push(region);
    });
    regions = regions.sort(sortByTimestamp);
  }
  return regions;
}
