import { Injectable } from '@angular/core';
import { CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/do';
import { AngularFireAuth } from 'angularfire2/auth';


@Injectable()
export class AuthGuard implements CanActivateChild {
	constructor(
		private router: Router,
		private auth: AngularFireAuth
	) { }
	canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
		return this.auth.authState.take(1).map(user => !!user).do(canActivate => {
			if (!canActivate) {
		        this.router.navigate(['/']);
			}
		});
	}
}
