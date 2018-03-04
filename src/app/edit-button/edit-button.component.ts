import { Component } from '@angular/core';
import { EditStateService } from '../edit-state.service';

@Component({
  selector: 'app-edit-button',
  templateUrl: './edit-button.component.html',
})
export class EditButtonComponent {

  constructor(public editState: EditStateService) { }

}
