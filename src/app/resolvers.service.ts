import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { AngularFireDatabase, DatabaseSnapshot } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserNameResolver implements Resolve<string> {

  constructor(private readonly db: AngularFireDatabase, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<string> {
    const userId = route.paramMap.get('userId');
    return this.db.database.ref('users').child(userId).child('name').once('value')
    .then(snap => {
      if (snap.exists()) {
        return snap.val();
      }
      console.error(`${userId} is not a valid user id`);
      this.router.navigate(['/']);
      return null;
    });
  }
}

@Injectable()
export class RegionNameResolver implements Resolve<string> {

  constructor(private readonly db: AngularFireDatabase, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<string> {
    const
    userId = route.paramMap.get('userId'),
    regionId = route.paramMap.get('regionId');
    return this.db.database.ref('regions').child(userId).child(regionId).child('name').once('value')
    .then(snap => {
      if (snap.exists()) {
        return snap.val();
      }
      console.error(`${regionId} is not a valid region id`);
      this.router.navigate(['/', userId, 'regions']);
      return null;
    });
  }
}

@Injectable()
export class ItemNameResolver implements Resolve<string> {

  constructor(private readonly db: AngularFireDatabase, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<string> {
    const
    userId = route.paramMap.get('userId'),
    regionId = route.paramMap.get('regionId'),
    itemId = route.paramMap.get('itemId');
    return this.db.database.ref('items').child(userId).child(regionId).child(itemId).child('name').once('value')
    .then(snap => {
      if (snap.exists()) {
        return snap.val();
      }
      console.error(`${itemId} is not a valid item id`);
      this.router.navigate(['/', userId, 'regions', regionId]);
      return null;
    });
  }
}

@Injectable()
export class ServerBackupResolver implements Resolve<DatabaseSnapshot> {

  constructor(private readonly db: AngularFireDatabase, private auth: AngularFireAuth, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<DatabaseSnapshot> {
    const userId = route.paramMap.get('userId');
    return this.auth.authState.first()
      .do(user => {
        if (!user) {
          console.error(`User is not logged in`);
          this.router.navigate(['/']);
        } else if (user.uid !== userId) {
          console.error(`Incorrect user`);
          this.router.navigate(['/']);
        }
      })
      .switchMap(user => this.db.database.ref('backup').child(user.uid).once('value'))
      .do(serverBackup => {
        if (!serverBackup) {
          console.error(`No server backup exists`);
          this.router.navigate(['/', userId]);
        }
      });
  }
}
