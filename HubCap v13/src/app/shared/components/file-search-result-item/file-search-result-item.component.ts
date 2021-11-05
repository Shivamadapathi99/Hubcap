import { Component, Inject, Input, Output, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

import { hasData } from '../../utilities/utilities';

import { BoxService } from '../../services/box.service';
import { StateService } from '../../services/state.service';
import { WorkQueueService } from '../../services/work-queue.service';

@Component({
  selector: 'app-file-search-result-item',
  templateUrl: './file-search-result-item.component.html',
  styleUrls: ['./file-search-result-item.component.scss']
})
export class FileSearchResultItemComponent implements OnInit, OnDestroy {

  @Input() settings: any = null;

  dataMain: any = {};

  addRelationFormData: any = null;
  editedWorkItem: any = null;
  searchResults: any[] = [];
  loadingFolderData = false;
  openFileItem: any = null;
  policyInfo: any = null;
  policyDocuments: any = null;
  relatedFiles: any[] = [];
  relatedTasks: any[] = [];

  // Subscriptions
  getAddRelationFormSub: Subscription | null = null;
  getRelatedFilesSub: Subscription | null = null;
  getRelatedTasksSub: Subscription | null = null;
  postAddRelationSub: Subscription | null = null;
  updateWorkLockedStatusSub: Subscription | null = null;

  constructor(
    private boxService: BoxService,
    private location: Location,
    private state: StateService,
    private workQueueService: WorkQueueService
  ) { }

  async ngOnInit() {
    this.state.dataMain.subscribe(result => {
      this.dataMain = result;
    });
    this.getPolicyData();
  }

  ngOnDestroy() {
    if (this.getRelatedFilesSub && !this.getRelatedFilesSub.closed) {
      this.getRelatedFilesSub.unsubscribe();
    }

    if (this.getRelatedTasksSub && !this.getRelatedTasksSub.closed) {
      this.getRelatedTasksSub.unsubscribe();
    }
    if (this.postAddRelationSub && !this.postAddRelationSub.closed) {
      this.postAddRelationSub.unsubscribe();
    }
  }

  addRelation($event: any) {
    // Need to get values from settings
    this.addRelationFormData = null;
    this.postAddRelationSub = this.workQueueService.PostAddRelation(this.searchResults[0]!.id, this.settings.type, this.settings.policyNumber, $event).subscribe(response => {

    });
  }

  getMetaDataQuery(type: string, searchText: string) {
    this.loadingFolderData = true;
    let from = '';
    let query = '';
    let fields: any = [];
    let ancestorFolderId = '';
    let limit = 0;
    let orderBy = null;

    switch (type) {
      case 'policyNumber':
        from = 'enterprise_45486919.policyFolder';
        query = 'policyNumber = :guid';
        fields = [
          'name',
          'created_at',
          'metadata.enterprise_45486919.policyFolder.policyNumber',
          'metadata.enterprise_45486919.policyFolder.insuredName',
          'metadata.enterprise_45486919.policyFolder.policyInceptionDate',
          'metadata.enterprise_45486919.policyFolder.policySource',
          'metadata.enterprise_45486919.policyFolder.policyStatus',
          'metadata.enterprise_45486919.policyFolder.productLine',
          'metadata.enterprise_45486919.policyFolder.productFamily',
          'metadata.enterprise_45486919.policyFolder.relatedPolicyNumber',
          'metadata.enterprise_45486919.policyFolder.relatedClaimNumbers',
          'metadata.enterprise_45486919.policyFolder.relatedWorkitemIds',
          'metadata.enterprise_45486919.policyFolder.relatedTaskNames',
          'metadata.enterprise_45486919.policyFolder.agencyCode',
          'metadata.enterprise_45486919.policyFolder.agentName',
          'metadata.enterprise_45486919.policyFolder.agentEmailAddress',
          'metadata.enterprise_45486919.policyFolder.submissionId'
        ];
        ancestorFolderId = '142722703603';
        limit = 50;
        break;
      case 'policyDocuments':
        from = 'enterprise_45486919.policydoc';
        query = 'policyNumber = :guid';
        fields = [
          'name',
          'created_at',
          'metadata.enterprise_45486919.policydoc.policyNumber'
        ];
        ancestorFolderId = '142722703603';
        limit = 50;
        orderBy = [{
          field_key: 'policyNumber',
          direction: 'asc'
        }];
        break;
      case 'bondNumber':
        break;
      case 'subID':
        break;
      case 'insuredName':
        break;
      default:
    }

    const queryObj: any = {
      from: from,
      query: query,
      query_params: {
        // guid: 'MM1234567'
        guid: searchText
      },
      fields: fields,
      ancestor_folder_id: ancestorFolderId,
      limit: limit
    };

    if (hasData(orderBy) === true) {
      queryObj.order_by = orderBy;
    }

    return queryObj;
  }

  getPolicyData() {
    // Need to get values from settings
    this.location.replaceState(`file-search/${this.settings.type}/${this.settings.policyNumber}`);
    this.boxService.PostBoxMetaDataQueries(this.getMetaDataQuery(this.settings.type, this.settings.policyNumber)).subscribe(response => {
      this.loadingFolderData = false;
      console.log(response);
      if (hasData(response) === true) {
        this.searchResults = response.entries;
        this.policyInfo = response.entries[0].metadata.enterprise_45486919.policyFolder;
        this.getPolicyDocuments();
        this.getRelatedTasks();
        this.getRelatedFiles();
      }
    });
  }

  getPolicyDocuments() {
    // Need to get values from settings
    this.boxService.PostBoxMetaDataQueries(this.getMetaDataQuery('policyDocuments', this.settings.policyNumber)).subscribe(response => {
      if (hasData(response) === true) {
        this.policyDocuments = response.entries.filter((item: any) => item.type === 'file');
      }
    });
  }

  getRelatedFiles() {
    // Need to get values from settings
    this.getRelatedFilesSub = this.workQueueService.GetRelatedFiles(this.searchResults[0]!.id, this.settings.type, this.settings.policyNumber).subscribe(response => {
      this.relatedFiles = response.entries;
    });
  }

  getRelatedTasks() {
    this.getRelatedTasksSub = this.workQueueService.GetWorkQueue('policyNumber', this.settings.policyNumber).subscribe(response => {
      this.relatedTasks = response.rows;
      console.log(this.relatedTasks);
    });
  }

  openAddRelation() {
    // need to get form number from backend somehow
    this.getAddRelationFormSub = this.workQueueService.GetWorkForm(14, 'FILE').subscribe(response => {
      this.addRelationFormData = response;
    });
  }



}
