import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { EditStateService } from '../edit-state.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

@Component({
  selector: 'app-edit-button',
  templateUrl: './edit-button.component.html',
})
export class EditButtonComponent {

  constructor(public editState: EditStateService, private auth: AngularFireAuth, private route: ActivatedRoute) { }

  visible: Observable<boolean> = Observable.combineLatest(this.auth.authState, this.route.paramMap)
  	.map(([user, params])  => user && user.uid === params.get('userId'));

}
