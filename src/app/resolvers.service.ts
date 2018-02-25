import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import 'rxjs/add/operator/map';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable()
export class UserNameResolver implements Resolve<string> {

	constructor(private readonly afs: AngularFirestore, private router: Router) { }
	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<string> {
    	const userId = route.paramMap.get('userId');
		return this.afs.firestore.collection('users').doc(userId).get().then(
			snap => {
				if (snap.exists) {
					return snap.get('name');
				}
				console.error(`${userId} is not a valid user id`);
				this.router.navigate(['/']);
				return null;
			},
			error => {
				console.error(`Error in resolving user: ${error}`);
				this.router.navigate(['/']);
				return null;
			}
		);
	}
}
