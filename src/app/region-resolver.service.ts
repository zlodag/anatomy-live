import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/first';
import { Region } from './models';

@Injectable()
export class RegionResolver implements Resolve<Region> {
  constructor(private readonly afs: AngularFirestore) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Region> {
  	return this.afs.doc<Region>('/regions/' + route.paramMap.get('regionId')).valueChanges().first();
  }
}