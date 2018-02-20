import { Component, OnInit } from '@angular/core';
import { EditStateService } from '../edit-state.service';

@Component({
  selector: 'app-edit-button',
  templateUrl: './edit-button.component.html'
})
export class EditButtonComponent implements OnInit {

  constructor(public editState: EditStateService) { }

  ngOnInit() {
  }

}
