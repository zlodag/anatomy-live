import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-add-string',
  templateUrl: './add-string.component.html',
  styleUrls: ['./add-string.component.css']
})
export class AddStringComponent implements OnInit {

  constructor() { }

  @Input() label: string;

  @Output() newString = new EventEmitter<string>();

  value: string = '';

  ngOnInit() {
  }

  add() {
    let s = this.value;
    if (s) {
      s = s.trim();
      if (s) {
        this.newString.emit(s);
        this.value = '';
      }
    }
  }

  // getNewString = () => {
  //   let s = prompt(`Add ${this.label}`);
  //   if (s) {
  //     s = s.trim();
  //     if (s) {
  //       this.newString.emit(s);
  //     }
  //   }
  // }
}
