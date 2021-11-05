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


@Component({
  selector: 'app-work-item-history',
  templateUrl: './work-item-history.component.html',
  styleUrls: ['./work-item-history.component.scss']
})
export class WorkItemHistoryComponent implements OnInit, OnChanges, OnDestroy {

  @Input() settings: any = null;
  @Output() windowClosed = new EventEmitter<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;
  @ViewChild('table') table: any;

  dataMain: any = {};
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
  workHistoryData: any | null = null;

  // Subscriptions
  getWorkQueueItemHistorySub: Subscription | null = null;

  constructor(
    private state: StateService,
    private workQueueService: WorkQueueService
  ) { }

  ngOnInit(): void {
    this.state.dataMain.subscribe(result => {
      this.dataMain = result;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (JSON.stringify(changes.settings.currentValue) !== JSON.stringify(changes.settings.previousValue)) {
      this.settings = changes.settings ? changes.settings.currentValue : this.settings;
      this.getWorkItemHistory();
    }
  }

  ngOnDestroy() {
    if (this.getWorkQueueItemHistorySub && !this.getWorkQueueItemHistorySub.closed) {
      this.getWorkQueueItemHistorySub.unsubscribe();
    }
  }

  close() {
    this.windowClosed.emit();
  }

  getWorkItemHistory() {
    this.getWorkQueueItemHistorySub = this.workQueueService.GetWorkQueueItemHistory(this.settings.data.instanceId).subscribe(response => {
      this.workHistoryData = response;
      this.initDataTable();
    });
  }

  hasData(data: any) {
    return hasData(data);
  }

  initDataTable() {
    this.pageSettings.tableSettings.columnTitles = this.workHistoryData.columns.map((item: any) => (item.title));
    this.pageSettings.tableSettings.pipes = this.workHistoryData.columns.map((item: any) => '');
    this.pageSettings.tableSettings.displayColumns = this.workHistoryData.columns.map((item: any) => (item.fieldName));
    this.pageSettings.tableSettings.data = new MatTableDataSource(this.workHistoryData.rows);
    setTimeout(() => {
      this.pageSettings.tableSettings.data.paginator = this.paginator;
      this.pageSettings.tableSettings.data.sort = this.sort;
    }, 2000);
  }

}
