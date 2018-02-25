import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
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

  constructor(private readonly afs: AngularFirestore, private afAuth: AngularFireAuth) { }

  private sub: Subscription;

  userId: string;
  myProfileName: string;
  otherProfiles: Profile[];

  ngOnInit() {
  	this.sub = 
      Observable.combineLatest(this.afs.collection('users', users => users.orderBy('name')).snapshotChanges(), this.afAuth.authState)
      .subscribe(([snaps, user]) => {

     //  });
     //    .map(actions => actions.map<Profile>(a => ({
     //        id: a.payload.doc.id,
     //        name: a.payload.doc.get('name')
     //    })))
     
  	  // .subscribe(
     //    ([user, profiles]) => {
    	  	this.userId = user ? user.uid : null;
    	  	this.myProfileName = null;
    	  	this.otherProfiles = [];
          snaps.forEach(snap => {
            const userId = snap.payload.doc.id;
            const name = snap.payload.doc.get('name');
            if (this.userId === userId) {
              this.myProfileName = name;
            } else {
              this.otherProfiles.push({
                id: userId,
                name: name
              });
            }
          });
    	  },
        error => {
          console.error('there was an error: ' + error);
        },
        () => {
          console.log('completed');
        }
      );
  }

  ngOnDestroy() {
  	this.sub.unsubscribe();
  }

  setProfile(userId: string, profileName: string){
  	this.afs.collection('users').doc(userId).set({name: profileName});
  }
}
