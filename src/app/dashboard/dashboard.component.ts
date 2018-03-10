import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Http, Headers } from '@angular/http';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { OwnerService } from '../owner.service';
import { saveAs } from 'file-saver/FileSaver';
import 'rxjs/add/operator/first';
import { database } from 'firebase';

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

  backup() {
    this.auth.authState.first().subscribe(user => {
      if (user) {
        Promise.all<database.DataSnapshot, database.DataSnapshot, database.DataSnapshot, database.DataSnapshot>([
          this.db.database.ref('regions').child(user.uid).once('value'),
          this.db.database.ref('items').child(user.uid).once('value'),
          this.db.database.ref('details').child(user.uid).once('value'),
          this.db.database.ref('images').child(user.uid).once('value'),
        ]).then(([regions, items, details, images]) => {
            const json = JSON.stringify({
              regions: regions.val(),
              items: items.val(),
              details: details.val(),
              images: images.val(),
            });
            const blob = new Blob([json], { type: 'application/json' });
            const now = new Date();
            saveAs(blob, `backup-${now.toISOString()}.json`);
        });
      }
    });
  }
}
