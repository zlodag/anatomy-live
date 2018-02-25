import { Component, OnInit } from '@angular/core';
import { EditStateService } from '../edit-state.service';

@Component({
  // selector: 'app-user',
  template: '<router-outlet></router-outlet>',
  // templateUrl: './user.component.html',
  // styleUrls: ['./user.component.css'],
  providers: [ EditStateService ]
})
export class UserComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

}
