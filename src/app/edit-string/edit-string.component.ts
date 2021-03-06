import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-edit-string',
  templateUrl: './edit-string.component.html',
})
export class EditStringComponent implements OnChanges {

  constructor() { }

  @Input() small = false;

  @Input() label: string;

  @Input() text: string;

  @Input() showMoveControls = false;

  @Input() showEditTextControls = true;

  @Input() disableMoveUp = false;

  @Input() disableMoveDown = false;

  @Output() update = new EventEmitter<string>();

  @Output() delete = new EventEmitter<void>();

  @Output() moveUp = new EventEmitter<void>();

  @Output() moveDown = new EventEmitter<void>();

  newString: string;

  ngOnChanges(changes: SimpleChanges) {
    const change = changes['text'];
    if (change) {
      this.newString = change.currentValue;
    }
  }

  validText() {
    return this.newString && this.newString.trim().length > 0 && this.newString.trim() !== this.text;
  }

  updateValue() {
    if (this.validText()) {
      this.update.emit(this.newString.trim());
    }
  }

}
