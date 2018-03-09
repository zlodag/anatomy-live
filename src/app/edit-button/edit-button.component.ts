import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { EditStateService } from '../edit-state.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-edit-button',
  templateUrl: './edit-button.component.html',
})
export class EditButtonComponent {

  constructor(public editState: EditStateService, private auth: AngularFireAuth, private route: ActivatedRoute) { }

  visible: Observable<boolean> = this.auth.authState
  	.map(user => user && user.uid === this.route.snapshot.paramMap.get('userId'));

}
