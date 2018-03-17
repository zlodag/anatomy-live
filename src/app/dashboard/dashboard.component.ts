import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { OwnerService } from '../owner.service';
import { saveAs } from 'file-saver/FileSaver';
import 'rxjs/add/operator/first';
import 'rxjs/add/observable/empty';
import { Observable } from 'rxjs/Observable';
import { database } from 'firebase';
import { RestoreObject } from '../models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {

  constructor(
    private readonly db: AngularFireDatabase,
    private auth: AngularFireAuth,
    public route: ActivatedRoute,
    public ownerService: OwnerService
    ) { }

  restoredTimestamp = this.auth.authState.switchMap(user => user ?
    this.db.object(this.db.database.ref('users').child(user.uid).child('restored')).valueChanges() :
    Observable.empty()
  );

  backupTimestamp = this.auth.authState.switchMap(user => user ?
    this.db.object(this.db.database.ref('backup').child(user.uid).child('timestamp')).valueChanges() :
    Observable.empty()
  );

  private getRestoreObject(uid: string): Promise<RestoreObject> {
    return Promise.all<database.DataSnapshot>([
      this.db.database.ref('regions').child(uid).once('value'),
      this.db.database.ref('items').child(uid).once('value'),
      this.db.database.ref('details').child(uid).once('value'),
      this.db.database.ref('nodes').child(uid).once('value'),
      this.db.database.ref('from').child(uid).once('value'),
      this.db.database.ref('to').child(uid).once('value'),
    ]).then(([regions, items, details, nodes, from, to]) => ({
      regions: regions.val(),
      items: items.val(),
      details: details.val(),
      nodes: nodes.val(),
      from: from.val(),
      to: to.val(),
    }));
  }

  backupToServer() {
    if (confirm('Any existing backup on the server will be overwritten')) {
      this.auth.authState.first().subscribe(user => {
        if (user) {
          this.getRestoreObject(user.uid).then(restoreObject =>
            this.db.database.ref('backup').child(user.uid).set({
              regions: restoreObject.regions,
              items: restoreObject.items,
              details: restoreObject.details,
              nodes: restoreObject.nodes,
              from: restoreObject.from,
              to: restoreObject.to,
              timestamp: database.ServerValue.TIMESTAMP,
            })
          );
        }
      });
    }
  }

  backupToFile() {
    this.auth.authState.first().subscribe(user => {
      if (user) {
        this.getRestoreObject(user.uid).then(restoreObject => {
          const json = JSON.stringify(restoreObject);
          const blob = new Blob([json], { type: 'application/json' });
          const now = new Date();
          saveAs(blob, `backup-${now.toISOString()}.json`);
        });
      }
    });
  }

}
