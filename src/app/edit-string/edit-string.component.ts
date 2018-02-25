import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-edit-string',
  templateUrl: './edit-string.component.html',
  styleUrls: ['./edit-string.component.css']
})
export class EditStringComponent implements OnInit {

  constructor() { }

  @Input() label: string;
  @Input() value: string;
  @Input() canDelete: boolean;

  @Output() newString = new EventEmitter<string>();
  @Output() delete = new EventEmitter<void>();

  ngOnInit() {
  }

  edit() {
    let s = prompt(`Edit ${this.label}`, this.value);
    if (s) {
      s = s.trim();
      if (s) {
        this.newString.emit(s);
      }
    }
  }

}
