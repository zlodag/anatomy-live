import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-add-string',
  templateUrl: './add-string.component.html',
  styleUrls: ['./add-string.component.css']
})
export class AddStringComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @Input() label : string;

  @Output() onNewString = new EventEmitter<string>();

  getNewString = () => {
  	let s = prompt(`Add ${this.label}`);
  	if (s) {
  		s = s.trim();
  		if (s) {
  			this.onNewString.emit(s);
  		}
  	}
  };
}
