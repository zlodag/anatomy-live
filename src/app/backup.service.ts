import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, DatabaseSnapshot } from 'angularfire2/database';
import { saveAs } from 'file-saver/FileSaver';
import 'rxjs/add/operator/first';

// interface BackupObject {
//   regions: any;
//   items: any;
//   details: any;
//   images: any;
// }

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
  items: TextNode[]
}

interface ItemNode extends TextNode {
  details: FieldNode[];
  images: ImageNode[];
}

interface RegionNode extends TextNode {
  items: ItemNode[];
}

interface FileReaderEventTarget extends EventTarget {
  result: string;
}

@Injectable()
export class BackupService {

  constructor(
    private readonly db: AngularFireDatabase,
    private auth: AngularFireAuth
  ) { }

  backup() {
    this.auth.authState.first().subscribe(user => {
      if (user) {
        Promise.all<DatabaseSnapshot, DatabaseSnapshot, DatabaseSnapshot, DatabaseSnapshot>([
          this.db.database.ref('regions').child(user.uid).once('value'),
          this.db.database.ref('items').child(user.uid).once('value'),
          this.db.database.ref('details').child(user.uid).once('value'),
          this.db.database.ref('images').child(user.uid).once('value'),
        ]).then(([regionsSnap, itemsSnap, detailsSnap, imagesSnap]) => {
          // const backup: RegionNode[] = [];
          // const json = JSON.stringify(backupObject);
          // const blob = new Blob([json], { type: 'application/json' });
          // const now = new Date();
          // saveAs(blob, `backup-${now.toISOString()}.json`);
        });
      }
    });
  }



}
