import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription }   from 'rxjs/Subscription';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authed',
  templateUrl: './authed.component.html',
  styleUrls: ['./authed.component.css']
})
export class AuthedComponent implements OnInit, OnDestroy {

  constructor(private afAuth: AngularFireAuth, private router: Router) { }

  private subscription: Subscription;

  name: string;

  ngOnInit() {
    this.subscription = this.afAuth.authState.subscribe(user => {
  		if (user) {
  			this.name = user.displayName;
  		} else {
  			this.router.navigate(['/login']);
  		}
  	});
  }

  ngOnDestroy(){
  	this.subscription.unsubscribe();
  }

  logOut() {
  	this.afAuth.auth.signOut();
  }
}
