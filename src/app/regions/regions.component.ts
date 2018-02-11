import { Component, OnInit } from '@angular/core';
import { EditStateService } from '../edit-state.service';

@Component({
  selector: 'app-regions',
  templateUrl: './regions.component.html',
  styleUrls: ['./regions.component.css'],
  providers: [EditStateService]
})
export class RegionsComponent implements OnInit {

  constructor(public editState: EditStateService) { }

  ngOnInit() {
  }

}
