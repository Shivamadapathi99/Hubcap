import { Component, Input, Output, EventEmitter, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { BoxService } from './../../services/box.service';
import { StateService } from '../../services/state.service';

import { CreateWorkFormControlModel, CreateWorkSubmissionModel } from '../../models/create-work.model';
import { StateModel } from '../../models/state.model';

import { characterLengthValidator } from '../../validators/utility-validators';
import { hasData, generateUUID, getFormattedDate } from '../../utilities/utilities';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit, OnChanges, OnDestroy {

  @Input() settings: any = null;
  @Output() saveForm = new EventEmitter<any>();

  dataMain: StateModel = new StateModel();
  fileAttachments: any[] = [];
  fileUploadRequired = false;
  form: FormGroup = new FormGroup({}, null, null);
  formInit = false;
  formIsValid = false;

  // Subscriptions
  formChangesSub: Subscription | null = null;

  constructor(
    private boxService: BoxService,
    private fb: FormBuilder,
    private state: StateService
  ) { }

  async ngOnInit() {
    this.state.dataMain.subscribe((result: any) => {
      this.dataMain = result;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (JSON.stringify(changes.settings.currentValue) !== JSON.stringify(changes.settings.previousValue)) {
      this.settings = changes.settings ? changes.settings.currentValue : this.settings;
      console.log('DYNAMIC FORM SETTINGS', this.settings);
      this.initForm();
    }
  }

  ngOnDestroy() {
    if (this.formChangesSub && !this.formChangesSub.closed) {
      this.formChangesSub.unsubscribe();
    }
  }

  getFormControlAnswerValue(fieldName: string, data: any) {
    let answerValue = null;
    if (hasData(this.settings.answerData) === true) {
      if (data.formControlType === 'date') {
        answerValue = new Date(this.settings.answerData[fieldName]);
      } else {
        answerValue = this.settings.answerData[fieldName];
      }
    }
    return answerValue;
  }

  getFormControlValidators(data: any[]) {
    const validators: any[] = [];
    data.forEach((item: any) => {
      switch (item.type) {
        case 'required':
          validators.push(Validators.required);
          break;
        case 'characterLength':
          validators.push(characterLengthValidator(item.options.min, item.options.max));
          break;
        case 'email':
          validators.push(Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"));
          break;
        default:
      }
    });
    return validators;
  }

  getSubmitData() {
    const submitData: CreateWorkSubmissionModel = {
      formId: this.settings.data.formId,
      formName: this.settings.data.formName,
      requestType: this.settings.data.requestType,
      itemId: hasData(this.settings.answerData) === true ? this.settings.answerData!.itemId : null,
      formData: [

      ],
      requestId: generateUUID(),
      requesterEmail: this.dataMain.user!.email
    };
    this.settings.data.formData.forEach((item: any) => {
      let saveObj: CreateWorkFormControlModel;
      if (item.formControlType !== 'fileUpload') {
        const formValue = this.form.get(item.formControlName)!.value;
        let value;
        let values: any[] | null = item.formControlType === 'array' ? formValue : null;

        if (item.dataType !== 'array') {
          value = item.formControlType === 'date' ? getFormattedDate(new Date(formValue)) : formValue;
        } else {
          value = null;
        }
        if (item.visible === false) {
          value = null;
        }
        saveObj = {
          id: item.id,
          formControlName: item.formControlName,
          value: value,
          values: values
        };
        submitData.formData.push(saveObj);
      } else {
        saveObj = {
          id: item.id,
          formControlName: item.formControlName,
          value: null,
          values: this.fileAttachments.map((item: any) => (item.id))
        };
        submitData.formData.push(saveObj);
      }

    });
    return submitData;
  }

  handleFieldChange() {
    this.updateFormState();
    this.validateFormDisabled();
  }

  initForm() {
    const formGroup: any = {
    };

    this.settings.data.formData.forEach((item: any) => {
      if (item.formControlType === 'fileUpload') {
        const validatorsResult = item.validators.find((item: any) => item.type === 'required');
        if (hasData(validatorsResult) === true) {
          this.fileUploadRequired = true;
        }
      } else {
        formGroup[item.formControlName] = new FormControl(this.getFormControlAnswerValue(item.formControlName, item), this.getFormControlValidators(item.validators));
      }
    })

    this.form = this.fb.group(formGroup);

    this.formChangesSub = this.form.valueChanges
      .pipe(debounceTime(500))
      .subscribe(x => {
        this.validateForm();
      });

    this.formInit = true;

    this.updateFormState();
    this.validateFormDisabled();

  }

  save() {
    const submitData = this.getSubmitData();
    this.saveForm.emit(submitData);
    this.form.markAsPristine();
    this.validateForm();
  }

  submit() {
    this.save();
  }

  updateFileAttachments($event: any) {
    // this.fileAttachments = $event.files;
    this.fileAttachments = $event;
    console.log(this.fileAttachments);
    this.validateForm();
  }

  updateFormState() {
    this.settings.data.formData.forEach((item: any) => {
      this.form.get(item.formControlName)?.disable();
      item.visible = false;
      if (item.formControlType !== 'fileUpload') {
        item.visible = true;
        if (hasData(item.formDisplayRules) === true) {
          if (item.formDisplayRules.length > 0) {
            item.formDisplayRules.forEach((displayRule: any) => {
              if (this.form.get(displayRule.name)!.value !== displayRule.value) {
                item.visible = false;
              }
            });
          } else {
            item.visible = true;
          }

        }
      } else {
        item.visible = true;
      }
      if (item.visible === true) {
        this.form.get(item.formControlName)?.enable();
      }
    })
  }

  validateForm() {
    let valid = false;
    if (this.form.valid === true) {
      valid = true;
    }
    if (this.fileUploadRequired === true) {
      valid = this.fileAttachments.length > 0 ? true : false;
    }
    if (this.form.pristine) {
      valid = false;
    }
    this.formIsValid = valid;
  }

  validateFormDisabled() {
    if (hasData(this.settings.answerData) === true) {
      if (this.settings.answerData!.formEditable === false) {
        this.form.disable();
      }
    }
  }

}
