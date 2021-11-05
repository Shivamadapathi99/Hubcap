import { Component, Input, Output, EventEmitter, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-box-edit-filename',
  templateUrl: './box-edit-filename.component.html',
  styleUrls: ['./box-edit-filename.component.scss']
})
export class BoxEditFilenameComponent implements OnInit, OnChanges {

  @Input() settings: any = null;
  @Output() itemEdited = new EventEmitter<any>();
  @Output() windowClosed = new EventEmitter<any>();

  form: FormGroup = new FormGroup({}, null, null);
  formInit = false;

  // Subscriptions
  formChangesSub: Subscription | null = null;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (JSON.stringify(changes.settings.currentValue) !== JSON.stringify(changes.settings.previousValue)) {
      this.settings = changes.settings ? changes.settings.currentValue : this.settings;
      this.initForm();
    }
  }

  ngOnDestroy() {
    if (this.formChangesSub && !this.formChangesSub.closed) {
      this.formChangesSub.unsubscribe();
    }
  }

  closeWindow() {
    this.windowClosed.emit();
  }

  initForm() {
    const formGroup: any = {
      fileName: [this.settings.data.name, []]
    };

    this.form = this.fb.group(formGroup);

    this.formChangesSub = this.form.valueChanges
      .pipe(debounceTime(500))
      .subscribe(x => {
      });

    this.formInit = true;

  }

  submit() {
    this.itemEdited.emit(
      {
        fileName: this.form.get('fileName')!.value
      }
    )
  }

}
