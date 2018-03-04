import { Component } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
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
  others: Profile[];
}

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
})
export class UserListComponent {

  constructor(private readonly db: AngularFireDatabase, private afAuth: AngularFireAuth, public editState: EditStateService) { }

  profilesObservable: Observable<Profiles> = Observable
    .combineLatest(this.afAuth.authState, this.db.list('users', ref => ref.orderByValue()).snapshotChanges())
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
        };
      }
      return profiles;
    });

  update(userId: string, profileName: string) {
    this.db.database.ref('users').child(userId).set(profileName);
  }

  delete(userId: string) {
    this.db.database.ref('users').child(userId).remove().catch(error => {
      if (error.code === 'PERMISSION_DENIED') {
        alert('Profile is not empty');
      }
    });
  }

}
