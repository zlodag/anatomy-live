import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription }   from 'rxjs/Subscription';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  constructor(private afAuth: AngularFireAuth, private router: Router) { }

  private subscription: Subscription;

  ngOnInit() {
  	this.subscription = this.afAuth.authState.subscribe(user => {
  		if (user) {
  			this.router.navigate(['/', user.uid]);
  		}
  	});
  }
  ngOnDestroy(){
  	this.subscription.unsubscribe();
  }

}
