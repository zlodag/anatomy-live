import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase/app';

// import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private afAuth: AngularFireAuth) {
  }

  // user: any;
  
  // private sub = this.afAuth.authState.subscribe(user => {
  // 	this.user = user;
  // });

  logOut() {
  	this.afAuth.auth.signOut();
  }
  logIn() {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }
  ngOnInit(){
  }
  // ngOnDestroy(){
  // 	// this.sub.unsubscribe();
  // }
}
