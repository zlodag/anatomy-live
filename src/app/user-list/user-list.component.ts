import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/withLatestFrom';

class Profile {
	id: string;
	name: string;
}

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {

  constructor(private readonly db: AngularFireDatabase, private afAuth: AngularFireAuth) { }

  private sub: Subscription;

  userId: string;
  myProfileName: string;
  otherProfiles: Profile[];

  ngOnInit() {
  	this.sub = 
      Observable.combineLatest(this.db.list(this.db.database.ref('users'), ref => ref.orderByValue()).snapshotChanges(), this.afAuth.authState)
      .subscribe(([snaps, user]) => {
    	  	this.userId = user ? user.uid : null;
    	  	this.myProfileName = null;
    	  	this.otherProfiles = [];
          snaps.forEach(snap => {
            const userId = snap.key;
            const name = snap.payload.val();
            if (this.userId === userId) {
              this.myProfileName = name;
            } else {
              this.otherProfiles.push({
                id: userId,
                name: name
              });
            }
          });
    	  });
  }

  ngOnDestroy() {
  	this.sub.unsubscribe();
  }

  setProfile(userId: string, profileName: string){
  	this.db.database.ref('users').child(userId).set(profileName);
  }
}
