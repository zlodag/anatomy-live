import { Component, OnInit } from '@angular/core';
import { EditStateService } from '../edit-state.service';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-edit-button',
  templateUrl: './edit-button.component.html'
})
export class EditButtonComponent implements OnInit {

  constructor(public editState: EditStateService, private afAuth: AngularFireAuth) { }

  ngOnInit() {
  	// this.afAuth.authState.subscribe(
  	// 	// user => user.n
  }

}
