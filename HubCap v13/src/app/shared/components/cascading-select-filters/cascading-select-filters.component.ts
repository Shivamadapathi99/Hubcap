import { Component, Input, Output, EventEmitter, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { getUniqueArrayByField, isInStringArray } from '../../utilities/utilities';

@Component({
  selector: 'app-cascading-select-filters',
  templateUrl: './cascading-select-filters.component.html',
  styleUrls: ['./cascading-select-filters.component.scss']
})
export class CascadingSelectFiltersComponent implements OnInit, OnChanges, OnDestroy {

  @Input() settings: any = {
    data: [],
    filters: [
    ]
  };
  @Output() dataUpdated = new EventEmitter<any>();

  data: any = null;
  form: FormGroup = new FormGroup({}, null, null);
  formInit = false;

  // Subscriptions
  formChangesSub: Subscription | null = null;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initForm();
    if (this.formInit === true && this.data.length > 0) {
      this.updateFilters();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.settings = changes.settings ? changes.settings.currentValue : this.settings;
    this.data = this.settings.data;
    if (this.formInit === true && this.data.length > 0) {
      this.updateFilters();
    }
    if (JSON.stringify(changes.settings.currentValue) !== JSON.stringify(changes.settings.previousValue)) {

    }
  }

  ngOnDestroy() {
    if (this.formChangesSub && !this.formChangesSub.closed) {
      this.formChangesSub.unsubscribe();
    }
  }

  initForm() {
    const formGroup: any = {};

    this.settings.filters.forEach((item: any) => {
      formGroup[item.fieldName] = new FormControl(item.defaultValue, []);
    });

    this.form = this.fb.group(formGroup);

    this.formChangesSub = this.form.valueChanges
      .pipe(debounceTime(500))
      .subscribe(x => {
      });

    this.formInit = true;

  }

  updateFilters() {
    let filteredData = this.data;
    this.settings.filters.forEach((item: any) => {
      item.options = getUniqueArrayByField(filteredData, item.fieldName);
      if (isInStringArray(item.options, this.form.get(item.fieldName)!.value) === false) {
        this.form.get(item.fieldName)?.setValue('All');
      }
      if (this.form.get(item.fieldName)!.value !== 'All') {
        filteredData = filteredData.filter((dataItem: any) => dataItem[item.fieldName] === this.form.get(item.fieldName)!.value);
      }
    });
    this.dataUpdated.emit(filteredData);
  }

}
