import { Component, Input, Output, EventEmitter, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';

import { WorkQueueService } from '../../services/work-queue.service';

@Component({
  selector: 'app-work-item-edit',
  templateUrl: './work-item-edit.component.html',
  styleUrls: ['./work-item-edit.component.scss']
})
export class WorkItemEditComponent implements OnInit, OnChanges, OnDestroy {

  @Input() settings: any = {
    data: [],
    editedWorkItem: null,
    editedWorkItemNum: 0,
    selectedItems: []
  };
  @Output() itemUpdated = new EventEmitter<any>();
  @Output() windowClosed = new EventEmitter<any>();

  editFormData: any | null = null;
  editedWorkItemDocuments: any[] = [];
  editedWorkItemNum: number = 0;

  // Subscriptions
  editFormDataSub: Subscription | undefined;
  updateWorkEditFormSub: Subscription | null = null;

  constructor(
    private workQueueService: WorkQueueService
  ) { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (JSON.stringify(changes.settings.currentValue) !== JSON.stringify(changes.settings.previousValue)) {
      this.settings = changes.settings ? changes.settings.currentValue : this.settings;
      this.openEditMode(this.settings.editedWorkItem, this.editedWorkItemNum);
    }
  }

  ngOnDestroy() {
    if (this.editFormDataSub && !this.editFormDataSub.closed) {
      this.editFormDataSub.unsubscribe();
    }
  }

  closeWindow() {
    this.editFormData = null;
    this.windowClosed.emit();
  }

  loadForm(id: number, formType: string) {
    this.editFormDataSub = this.workQueueService.GetWorkForm(id, formType).subscribe(response => {
      this.editFormData = response;
    });
  }

  openEditMode(element: any, elementNum: number) {
    this.settings.editedWorkItem = element;
    this.editedWorkItemNum = this.settings.selectedItems.length === 0 ? elementNum : this.settings.selectedItems.findIndex((item: any) => item.itemId === element.itemId);
    this.editedWorkItemDocuments = element.boxDetails.filter((item: any) => item.boxType === 'file').map((item: any) => ({ id: item.boxId }));
    this.loadForm(element.formId, element.formType);
  }

  updateEditModeItem(direction: string) {
    const dataSource = this.settings.selectedItems.length > 0 ? this.settings.selectedItems : this.settings.data;
    if (direction === 'previous') {
      this.editedWorkItemNum = this.editedWorkItemNum > 0 ? this.editedWorkItemNum - 1 : 0;
    }
    if (direction === 'next') {
      this.editedWorkItemNum = this.editedWorkItemNum < (dataSource.length - 1) ? this.editedWorkItemNum + 1 : (dataSource.length - 1);
    }
    this.openEditMode(dataSource[this.editedWorkItemNum], this.editedWorkItemNum);
  }

  updateWorkQueueItem(data: any) {
    this.updateWorkEditFormSub = this.workQueueService.PutWorkEditForm(data).subscribe(response => {
      this.itemUpdated.emit(data);
      const statusValue = data.formData.find((item: any) => item.formControlName === 'status')!.value;
      if (statusValue === 'Completed' || statusValue === 'Future Task') {
        if (this.editedWorkItemNum !== this.settings.data.length - 1) {
          this.updateEditModeItem('next');
        } else {
          this.editFormData = null;
          this.editedWorkItemDocuments = [];
          this.closeWindow();
        }
      }
      this.itemUpdated.emit();
    });
  }

}
