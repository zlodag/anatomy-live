import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/withLatestFrom';
import { EditStateService } from '../edit-state.service';

interface Profile {
	id: string;
	name: string;
}
interface Profiles {
  mine?: Profile;
  others: Profile[]
}

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {

  constructor(private readonly db: AngularFireDatabase, private afAuth: AngularFireAuth, public editState: EditStateService) { }

  // private sub: Subscription;
  // profiles = Observable.combineLatest(this.afAuth.authState, this.editState.edit, this.db.list('users', ref => ref.orderByValue()).snapshotChanges())
  // .map(([user, edit, snaps]) => snaps.map(snap => {
  //   const mine = user && user.uid === snap.key;
  //   return {
  //     id: snap.key,
  //     name: snap.payload.val(),
  //     mine: mine,
  //     edit: mine && edit
  //   };
  // }));
  profilesObservable: Observable<Profiles> = Observable.combineLatest(this.afAuth.authState, this.db.list('users', ref => ref.orderByValue()).snapshotChanges())
    .map(([user, snaps]) => {
      const profiles: Profiles = {
        others: []
      };
      snaps.forEach(snap => {
        const profile: Profile = {
          id: snap.key,
          name: snap.payload.val()
        };
        if (user && user.uid === profile.id) {
          profiles.mine = profile;
        } else {
          profiles.others.push(profile);
        }
      });
      if (!profiles.mine && user) {
        profiles.mine = {
          id: user.uid,
          name: null
        }
      }
      return profiles;
    });

  ngOnInit() {
    // this.sub = Observable.combineLatest(this.afAuth.authState, this.editState.edit, this.db.list('users', ref => ref.orderByValue()).snapshotChanges())
    // .map(([user, edit, snaps]) => {
    //   snaps.map(snap => {
    //     const mine = user && user.uid === snap.key;
    //     return {
    //       id: snap.key,
    //       name: snap.payload.val(),
    //       mine: mine,
    //       edit: mine && edit
    //     };
    //   });
    // });
  	// this.sub = 
   //    Observable.combineLatest(this.db.list(this.db.database.ref('users'), ref => ref.orderByValue()).snapshotChanges(), this.afAuth.authState)
   //    .subscribe(([snaps, user]) => {
   //  	  	this.userId = user ? user.uid : null;
   //  	  	this.myProfileName = null;
   //  	  	this.otherProfiles = [];
   //        snaps.forEach(snap => {
   //          const userId = snap.key;
   //          const name = snap.payload.val();
   //          if (this.userId === userId) {
   //            this.myProfileName = name;
   //          } else {
   //            this.otherProfiles.push({
   //              id: userId,
   //              name: name
   //            });
   //          }
   //        });
   //  	  });
  }

  ngOnDestroy() {
  	// this.sub.unsubscribe();
  }

  update(userId: string, profileName: string){
  	this.db.database.ref('users').child(userId).set(profileName);
  }

  delete(userId: string) {
    this.db.database.ref('users').child(userId).remove().catch(error => {
      if (error.code == 'PERMISSION_DENIED') {
        alert('Profile is not empty');
      }
    });
  }
  
}
