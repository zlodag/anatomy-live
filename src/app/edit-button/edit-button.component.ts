import { Component } from '@angular/core';
import { OwnerService } from '../owner.service';

@Component({
  selector: 'app-edit-button',
  templateUrl: './edit-button.component.html',
})
export class EditButtonComponent {

  constructor(public ownerService: OwnerService) { }

}
