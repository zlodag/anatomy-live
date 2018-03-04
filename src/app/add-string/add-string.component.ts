import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-add-string',
  templateUrl: './add-string.component.html',
})
export class AddStringComponent {

  constructor() { }

  @Input() label: string;

  @Output() newString = new EventEmitter<string>();

  value = '';

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
}
