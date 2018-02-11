import { Component } from '@angular/core';
import { EditStateService } from './edit-state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public editState: EditStateService) {
  }
}
