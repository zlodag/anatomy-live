import { Component, Input } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { DETAIL_FIELDS, RestoreObject } from '../models';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, DatabaseSnapshot } from 'angularfire2/database';
import 'rxjs/add/operator/first';
import { database } from 'firebase';

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

interface CourseNode extends TextNode {
  to: TimestampTextNode[];
  from: TimestampTextNode[];
}

interface DisplayObject {
  regions: RegionNode[];
  nodes: CourseNode[];
}

interface FileReaderEventTarget extends EventTarget {
  result: string;
}

function sortByKey(a: Node, b: Node): number {
  return a.key > b.key ? 1 : a.key < b.key ? -1 : 0;
}
function sortByText(a: TextNode, b: TextNode): number {
  return a.text > b.text ? 1 : a.text < b.text ? -1 : 0;
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
  @Input() displayObject: DisplayObject;
  @Input() restoreObject: RestoreObject;

  restore() {
    if (this.restoreObject && confirm('Any existing data will be overwritten')) {
      this.auth.authState.first().subscribe(user => {
        if (user && user.uid === this.route.snapshot.paramMap.get('userId')) {
          this.db.database.ref().update({
              [`users/${user.uid}/restored`]: database.ServerValue.TIMESTAMP,
              [`regions/${user.uid}`]: this.restoreObject.regions,
              [`items/${user.uid}`]: this.restoreObject.items,
              [`details/${user.uid}`]: this.restoreObject.details,
              [`nodes/${user.uid}`]: this.restoreObject.nodes,
              [`from/${user.uid}`]: this.restoreObject.from,
              [`to/${user.uid}`]: this.restoreObject.to,
          })
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
  displayObject: DisplayObject = fromSnap(this.backupData);
  restoreObject: RestoreObject = {
    regions: this.backupData.child('regions').val(),
    items: this.backupData.child('items').val(),
    details: this.backupData.child('details').val(),
    nodes: this.backupData.child('nodes').val(),
    from: this.backupData.child('from').val(),
    to: this.backupData.child('to').val(),
  };
}

@Component({
  templateUrl: './file-backup.component.html',
})
export class FileBackupComponent {

  displayObject: DisplayObject;

  restoreObject: RestoreObject;

  fileSelected(files: FileList) {
    if (files.length) {
      const reader = new FileReader();
      reader.onload = event => {
        const json = (<FileReaderEventTarget>event.target).result;
        this.restoreObject = JSON.parse(json);
        this.displayObject = fromParsed(this.restoreObject);
      };
      reader.readAsText(files[0]);
    }
  }

}

function fromSnap(dataSnap: DatabaseSnapshot): DisplayObject {
  const displayObject: DisplayObject = {
    regions: [],
    nodes: [],
  };
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
      displayObject.regions.push(region);
      return false;
    });
    displayObject.regions.sort(sortByTimestamp);
    dataSnap.child('nodes').forEach(nodeSnap => {
      const node: CourseNode = {
        key: nodeSnap.key,
        text: nodeSnap.val(),
        from: [],
        to: [],
      };
      dataSnap.child('from').child(nodeSnap.key).forEach(otherSnap => {
        const other: TimestampTextNode = {
          key: otherSnap.key,
          text: dataSnap.child('nodes').child(otherSnap.key).val(),
          timestamp: otherSnap.val(),
        };
        node.from.push(other);
        return false;
      });
      node.from = node.from.sort(sortByTimestamp);
      dataSnap.child('to').child(nodeSnap.key).forEach(otherSnap => {
        const other: TimestampTextNode = {
          key: otherSnap.key,
          text: dataSnap.child('nodes').child(otherSnap.key).val(),
          timestamp: otherSnap.val(),
        };
        node.to.push(other);
        return false;
      });
      node.to = node.to.sort(sortByTimestamp);
      displayObject.nodes.push(node);
      return false;
    });
    displayObject.nodes.sort(sortByText);
  }
  return displayObject;
}

function fromParsed(data: RestoreObject): DisplayObject {
  const displayObject: DisplayObject = {
    regions: [],
    nodes: [],
  };
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
      displayObject.regions.push(region);
    });
    displayObject.regions = displayObject.regions.sort(sortByTimestamp);
  }
  if (data.nodes) {
    Object.keys(data.nodes).forEach(nodeKey => {
      const node: CourseNode = {
        key: nodeKey,
        text: data.nodes[nodeKey],
        from: [],
        to: [],
      };
      if (data.from && nodeKey in data.from) {
        const nodeLinksObj = data.from[nodeKey];
        Object.keys(nodeLinksObj).forEach(otherNodeKey => {
          const other: TimestampTextNode = {
            key: otherNodeKey,
            text: data.nodes[otherNodeKey],
            timestamp: nodeLinksObj[otherNodeKey],
          };
          node.from.push(other);
        });
        node.from = node.from.sort(sortByTimestamp);
      }
      if (data.to && nodeKey in data.to) {
        const nodeLinksObj = data.to[nodeKey];
        Object.keys(nodeLinksObj).forEach(otherNodeKey => {
          const other: TimestampTextNode = {
            key: otherNodeKey,
            text: data.nodes[otherNodeKey],
            timestamp: nodeLinksObj[otherNodeKey],
          };
          node.to.push(other);
        });
        node.to = node.to.sort(sortByTimestamp);
      }
      displayObject.nodes.push(node);
    });
    displayObject.nodes.sort(sortByText);
  }
  return displayObject;
}
