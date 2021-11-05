import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { LocalDataService } from '../../services/local-data.service';
import { StateService } from '../../services/state.service';
import { WorkQueueService } from './../../services/work-queue.service';

import { FormListItemModel } from '../../models/form-list.model';
import { StateModel } from '../../models/state.model';

@Component({
  selector: 'app-create-work',
  templateUrl: './create-work.component.html',
  styleUrls: ['./create-work.component.scss']
})
export class CreateWorkComponent implements OnInit, OnDestroy {

  dataMain: StateModel = new StateModel();
  formData = null;
  formList: Array<FormListItemModel> = [];
  formType = new FormControl();

  // Subscriptions
  formListSub: Subscription | undefined;
  formDataSub: Subscription | undefined;
  postWorkFormSub: Subscription | undefined;

  constructor(
    private state: StateService,
    private workQueueService: WorkQueueService
  ) {
  }

  ngOnDestroy() {
    if (this.formListSub && !this.formListSub.closed) {
      this.formListSub.unsubscribe();
    }
    if (this.formDataSub && !this.formDataSub.closed) {
      this.formDataSub.unsubscribe();
    }
    if (this.postWorkFormSub && !this.postWorkFormSub.closed) {
      this.postWorkFormSub.unsubscribe();
    }
  }

  async ngOnInit() {
    this.state.dataMain.subscribe((result: any) => {
      this.dataMain = result;
    });

    this.workQueueService.GetWorkFormTypes().subscribe(response => {
      this.formList = response;
    });
  }

  loadForm($event: any) {
    console.log($event);
    this.formDataSub = this.workQueueService.GetWorkForm($event.value.formId, $event.value.formType).subscribe(response => {
      this.formData = response;
    });
  }

  saveForm($event: any) {
    this.postWorkFormSub = this.workQueueService.PostWorkForm($event).subscribe(response => {
      this.formData = null;
    });
  }

}
