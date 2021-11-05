import { Component, Inject, EventEmitter, Input, Output, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OktaAuthService } from '../../services/okta.service';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { hasData } from '../../utilities/utilities';

import { StateService } from '../../services/state.service';
import { BoxService } from '../../services/box.service';

@Component({
  selector: 'app-file-search-form',
  templateUrl: './file-search-form.component.html',
  styleUrls: ['./file-search-form.component.scss']
})
export class FileSearchFormComponent implements OnInit, OnDestroy {

  @Input() settings: any = null;
  @Output() formSubmitted = new EventEmitter<any>();

  dataMain: any = {};
  form: FormGroup = new FormGroup({}, null, null);
  formInit = false;

  // Subscriptions
  formChangesSub: Subscription | null = null;

  constructor(
    private boxService: BoxService,
    private fb: FormBuilder,
    private state: StateService
  ) { }

  async ngOnInit() {
    this.state.dataMain.subscribe(result => {
      this.dataMain = result;
    });

    this.initForm();
  }

  ngOnDestroy() {
    if (this.formChangesSub && !this.formChangesSub.closed) {
      this.formChangesSub.unsubscribe();
    }
  }

  initForm() {
    const formGroup: any = {
      searchType: ['selectOption', [Validators.required]],
      searchText: [null, [Validators.required]]
    };

    this.form = this.fb.group(formGroup);

    this.formChangesSub = this.form.valueChanges
      .pipe(debounceTime(500))
      .subscribe(x => {
      });

    this.formInit = true;

  }

  loadSearchForm() {

  }

  submit() {

  }

}
