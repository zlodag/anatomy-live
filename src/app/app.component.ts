import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(public afAuth: AngularFireAuth) {
  }

  logOut() {
  	this.afAuth.auth.signOut();
  }
  logIn() {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }
  ngOnInit(){
  }

}
