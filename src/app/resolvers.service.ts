import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/first';

@Injectable()
export class RegionListResolver implements Resolve<string[]> {
  constructor(private readonly afs: AngularFirestore) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string[]> {
  	return this.afs.collection('/regions', ref => ref.orderBy('ts')).snapshotChanges().map(actions => actions.map(a => a.payload.doc.id)).first();
  }
}

@Injectable()
export class ItemListResolver implements Resolve<string[]> {
  constructor(private readonly afs: AngularFirestore) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string[]> {
  	return this.afs.collection('/items', ref => ref.where('region', '==', route.paramMap.get('regionId'))).snapshotChanges().map(actions => actions.map(a => a.payload.doc.id)).first();
  }
}

// @Injectable()
// export class ItemDetailResolver implements Resolve<Details> {
//   constructor(private readonly afs: AngularFirestore) { }
//   resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Details> {
//   	return this.afs.collection('/details').doc<Details>(route.paramMap.get('itemId')).valueChanges().first();
//   }
// }