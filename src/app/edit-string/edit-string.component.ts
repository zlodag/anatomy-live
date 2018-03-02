import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
// import { EditStateService } from '../edit-state.service';

@Component({
  selector: 'app-edit-string',
  templateUrl: './edit-string.component.html',
  styleUrls: ['./edit-string.component.css']
})
export class EditStringComponent implements OnInit, OnChanges {

  constructor(
    // public editState: EditStateService
    ) { }

  @Input() label: string;
  @Input() text: string;

  newString: string;

  @Output() update = new EventEmitter<string>();
  @Output() delete = new EventEmitter<void>();

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    // for (let propName in changes) {
    //   let chng = changes[propName];
    //   let cur  = JSON.stringify(chng.currentValue);
    //   let prev = JSON.stringify(chng.previousValue);
    //   console.log(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
    //   if (propName == 'text') {
    //     this.newString = change.previousValue;
    //   }
    // }
    const change = changes['text'];
    if (change) {
      this.newString = change.currentValue;
    }
  }

  validText() {
    return this.newString && this.newString.trim().length > 0 && this.newString.trim() != this.text;
  }

  updateValue() {
    if (this.validText()) {
      this.update.emit(this.newString.trim());
    }
  }

}
