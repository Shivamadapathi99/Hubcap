import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { hasData } from '../../utilities/utilities';

import { StateService } from '../../services/state.service';
import { WorkQueueService } from '../../services/work-queue.service';

import { WorkQueueFilterOptions } from '../../models/work-queue.model';

import { BOX_URL } from '../../constants/constants';

@Component({
  selector: 'app-work-queue',
  templateUrl: './work-queue.component.html',
  animations: [],
  styleUrls: ['./work-queue.component.scss']
})
export class WorkQueueComponent implements OnInit, OnChanges, OnDestroy {

  @Input() settings: any = null;
  @Input() name: string = 'myQueue';
  @Input() taskStatusSelection: string = 'Not Started';
  @Output() itemUpdated = new EventEmitter<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;
  @ViewChild('table') table: any;

  dataMain: any = {};

  editedWorkItem: any = null;
  filterOptions: WorkQueueFilterOptions = {
    stepNames: [],
    taskStatuses: [
      'Not Started',
      'In-Progress',
      'Completed',
      'Future Task'
    ],
    workflowNames: []
  }
  filteredData: any[] = [];
  filteredTableData: any[] = [];
  form: FormGroup = new FormGroup({}, null, null);
  formInit = false;
  pageSettings = {
    tableSettings: {
      data: new MatTableDataSource(),
      displayColumns: [
      ],
      columnTitles: [
      ],
      pipes: [
      ]
    },
    numPages: 0,
    pageSize: 20
  };
  selectedTableRows: Array<any> = [];
  selectedWorkHistoryItem: any = null;
  workQueueVisible = true;

  // Subscriptions
  formChangesSub: Subscription | null = null;
  updateWorkEditFormSub: Subscription | null = null;
  updateWorkLockedStatusSub: Subscription | null = null;
  updateWorkStatusSub: Subscription | null = null;

  constructor(
    private fb: FormBuilder,
    private state: StateService,
    private workQueueService: WorkQueueService
  ) { }

  ngOnInit(): void {

    this.state.dataMain.subscribe(result => {
      this.dataMain = result;
      this.initDataTable();
    });

    this.initForm();
    this.initDataTable();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (JSON.stringify(changes.settings.currentValue) !== JSON.stringify(changes.settings.previousValue)) {
      this.settings = changes.settings ? changes.settings.currentValue : this.settings;
    }
  }

  ngOnDestroy() {
    if (this.formChangesSub && !this.formChangesSub.closed) {
      this.formChangesSub.unsubscribe();
    }
    if (this.updateWorkEditFormSub && !this.updateWorkEditFormSub.closed) {
      this.updateWorkEditFormSub.unsubscribe();
    }
    if (this.updateWorkStatusSub && !this.updateWorkStatusSub.closed) {
      this.updateWorkStatusSub.unsubscribe();
    }
    if (this.updateWorkLockedStatusSub && !this.updateWorkLockedStatusSub.closed) {
      this.updateWorkLockedStatusSub.unsubscribe();
    }
  }

  closeWorkItemEdit() {
    this.editedWorkItem = null;
    this.initDataTable();
    this.workQueueVisible = true;
  }

  closeWorkItemHistory() {
    this.selectedWorkHistoryItem = null;
    this.workQueueVisible = true;
  }

  filterTableData() {
    let filteredData: any[] = this.dataMain.queue.data;
    if (this.settings.name === 'myQueue') {
      filteredData = this.dataMain.queue.data.filter((item: any) => this.dataMain.user.email === item.assignedTo);
    } else {
      filteredData = this.dataMain.queue.data.filter((item: any) => item.assignedTo !== this.dataMain.user.email);
    }

    this.filteredTableData = filteredData;
  }

  hasData(data: any) {
    return hasData(data);
  }

  initDataTable() {
    this.filterTableData();
    this.pageSettings.tableSettings.columnTitles = this.dataMain.queue.columnTitles;
    this.pageSettings.tableSettings.displayColumns = this.dataMain.queue.displayColumns;
    this.pageSettings.tableSettings.pipes = this.dataMain.queue.pipes;
    this.pageSettings.tableSettings.data = new MatTableDataSource(this.filteredTableData);
    this.filteredData = this.filteredTableData;
    this.selectedTableRows = [];
    this.filteredData.forEach((item: any) => {
      item.selected = false;
    });
    setTimeout(() => {
      this.pageSettings.tableSettings.data.paginator = this.paginator;
      this.pageSettings.tableSettings.data.sort = this.sort;
    }, 2000);
  }

  initForm() {
    const formGroup: any = {
      stepName: [null, []],
      taskStatus: [this.settings.taskStatusSelection, []],
      workflowName: [null, []]
    };

    this.form = this.fb.group(formGroup);

    this.formChangesSub = this.form.valueChanges
      .pipe(debounceTime(500))
      .subscribe(x => {
      });

    this.formInit = true;

  }

  openAttachment(boxIdType: string, attachment: string) {
    window.open(`${BOX_URL}${boxIdType}/${attachment}`, '_blank');
  }

  paginatorInitialized($event: any) {
  }

  refreshWorkQueue() {
    this.itemUpdated.emit();
  }

  updateFilteredData($event: any) {
    this.pageSettings.tableSettings.data = new MatTableDataSource($event);
    this.filteredData = $event;
    setTimeout(() => {
      this.pageSettings.tableSettings.data.paginator = this.paginator;
      this.pageSettings.tableSettings.data.sort = this.sort;
    }, 2000);
  }

  updateLockedStatus(element: any, status: boolean) {
    this.updateWorkLockedStatusSub = this.workQueueService.PutWorkState(
      {
        itemId: element.itemId,
        lockedStatus: status,
        lockedBy: this.dataMain.user.email
      }
    ).subscribe(response => {
      this.refreshWorkQueue();
    });
  }

  updateSelectedRows(i: number, $event: any) {
    this.filteredData[i].selected = $event.checked;
    this.selectedTableRows = this.filteredData.filter((item: any) => item.selected === true);
  }

  updateTaskStatus(element: any, taskStatus: string) {
    element.status = taskStatus;
    this.updateWorkStatusSub = this.workQueueService.PutWorkState(
      {
        itemId: element.itemId,
        status: taskStatus
      }
    ).subscribe(response => {
      this.refreshWorkQueue();
    });
  }

}
