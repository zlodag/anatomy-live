import { Component, OnInit } from '@angular/core';
import { EditStateService } from '../edit-state.service';

@Component({
  selector: 'app-regions-overview',
  templateUrl: './regions-overview.component.html',
  styleUrls: ['./regions-overview.component.css'],
  providers: [
    EditStateService
  ],
})
export class RegionsOverviewComponent implements OnInit {

  constructor(public editState: EditStateService) { }

  ngOnInit() {
  }

}
