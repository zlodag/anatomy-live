import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { OwnerService } from '../owner.service';
// import { saveAs } from 'file-saver/FileSaver';
import 'rxjs/add/operator/first';
import { database } from 'firebase';

// interface BackupObject {
//   regions: any;
//   items: any;
//   details: any;
// }
//
// interface FileReaderEventTarget extends EventTarget {
//     result: string;
// }

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

  // selectedFile: File = null;

  restoreTimestamp = this.auth.authState
    .switchMap(user => this.db.object(this.db.database.ref('backup').child(user.uid).child('timestamp')).valueChanges());

  backup() {
    if (confirm('Any existing backup will be overwritten')) {
      this.auth.authState.first().subscribe(user => {
        if (user) {
          Promise.all<database.DataSnapshot, database.DataSnapshot, database.DataSnapshot>([
            this.db.database.ref('regions').child(user.uid).once('value'),
            this.db.database.ref('items').child(user.uid).once('value'),
            this.db.database.ref('details').child(user.uid).once('value'),
          ]).then(([regions, items, details]) => {
              this.db.database.ref('backup').child(user.uid).set({
                regions: regions.val(),
                items: items.val(),
                details: details.val(),
                timestamp: database.ServerValue.TIMESTAMP,
              });

              // const backupObject: BackupObject = {
              //   regions: regions.val(),
              //   items: items.val(),
              //   details: details.val(),
              // };
              // const json = JSON.stringify(backupObject);
              // const blob = new Blob([json], { type: 'application/json' });
              // const now = new Date();
              // saveAs(blob, `backup-${now.toISOString()}.json`);
          });
        }
      });
    }
  }

  // fileSelected(files: FileList) {
  //   this.selectedFile = files.length ? files[0] : null;
  // }

  // restore() {
  //   const file = this.selectedFile;
  //   if (file) {
  //     this.auth.authState.first().subscribe(user => {
  //       if (user) {
  //         const reader = new FileReader();
  //         reader.onload = event => {
  //           const json = (<FileReaderEventTarget>event.target).result;
  //           const backupObject: BackupObject = JSON.parse(json);
  //           if (confirm('All existing data will be deleted')) {
  //             const updateObject = {
  //               [`regions/${user.uid}`]: backupObject.regions,
  //               [`items/${user.uid}`]: backupObject.items,
  //               [`details/${user.uid}`]: backupObject.details,
  //             };
  //             this.db.database.ref().update(updateObject, error => {
  //               if (error) {
  //                 // alert(error.message);
  //                 console.error(error.message);
  //               } else {
  //                 alert('Successfully restored from backup file');
  //               }
  //             });
  //           }
  //         };
  //         reader.readAsText(file);
  //       }
  //     });
  //     // this.selectedFile = null;
  //   }
  // }

}
