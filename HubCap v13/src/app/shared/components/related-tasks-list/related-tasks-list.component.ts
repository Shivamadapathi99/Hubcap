import { Component, Inject, Input, Output, EventEmitter, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';

import { StateService } from '../../services/state.service';
import { WorkQueueService } from '../../services/work-queue.service';

@Component({
  selector: 'app-related-tasks-list',
  templateUrl: './related-tasks-list.component.html',
  styleUrls: ['./related-tasks-list.component.scss']
})
export class RelatedTasksListComponent implements OnInit, OnChanges, OnDestroy {

  @Input() settings: any = null;
  @Output() itemSelected = new EventEmitter<any>();
  @Output() updateRelatedTasks = new EventEmitter<any>();

  // Subscriptions
  updateWorkLockedStatusSub: Subscription | null = null;

  dataMain: any = {};

  constructor(
    private state: StateService,
    private workQueueService: WorkQueueService
  ) { }

  async ngOnInit() {
    this.state.dataMain.subscribe(result => {
      this.dataMain = result;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (JSON.stringify(changes.settings.currentValue) !== JSON.stringify(changes.settings.previousValue)) {
      this.settings = changes.settings ? changes.settings.currentValue : this.settings;
    }
  }

  ngOnDestroy(): void {
    if (this.updateWorkLockedStatusSub && !this.updateWorkLockedStatusSub.closed) {
      this.updateWorkLockedStatusSub.unsubscribe();
    }
  }

  openTask(task: any) {
    this.itemSelected.emit(task);
  }

  updateLockedStatus(element: any, status: boolean) {
    this.updateWorkLockedStatusSub = this.workQueueService.PutWorkState(
      {
        itemId: element.itemId,
        lockedStatus: status,
        lockedBy: this.dataMain.user.email
      }
    ).subscribe(response => {
      this.updateRelatedTasks.emit();
    });
  }

}
