import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import 'rxjs/add/operator/map';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class UserNameResolver implements Resolve<string> {

	constructor(private readonly db: AngularFireDatabase, private router: Router) { }
	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<string> {
    	const userId = route.paramMap.get('userId');
		return this.db.database.ref('users').child(userId).once('value')
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

	constructor(private readonly db: AngularFireDatabase, private router: Router) { }
	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<string> {
    	const
    		userId = route.paramMap.get('userId'),
    		regionId = route.paramMap.get('regionId');
		return this.db.database.ref('regions').child(userId).child(regionId).once('value')
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

	constructor(private readonly db: AngularFireDatabase, private router: Router) { }
	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<string> {
    	const
    		userId = route.paramMap.get('userId'),
    		regionId = route.paramMap.get('regionId'),
    		itemId = route.paramMap.get('itemId');
		return this.db.database.ref('items').child(userId).child(regionId).child(itemId).once('value')
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