import { Component, Input, Output, EventEmitter, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit, OnChanges {

  @Input() settings: any = {
    type: 'button',
    text: 'Submit',
    icon: null,
    iconPosition: 'left',
    backgroundColor: 'backgroundColorCapBlue',
    textColor: 'textCapWhite'
  };
  @Output() clicked = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (JSON.stringify(changes.settings.currentValue) !== JSON.stringify(changes.settings.previousValue)) {
      this.settings = changes.settings ? changes.settings.currentValue : this.settings;
    }
  }

  click() {
    this.clicked.emit();
  }

}
