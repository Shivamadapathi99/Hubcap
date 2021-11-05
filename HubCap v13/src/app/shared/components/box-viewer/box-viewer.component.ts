import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OktaAuthService } from '../../services/okta.service';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { hasData } from '../../utilities/utilities';

import { AuthService } from '../../services/auth.service';
import { BoxService } from '../../services/box.service';
import { StateService } from '../../services/state.service';
import { WorkQueueService } from '../../services/work-queue.service';

@Component({
  selector: 'app-box-viewer',
  templateUrl: './box-viewer.component.html',
  styleUrls: ['./box-viewer.component.scss']
})
export class BoxViewerComponent implements OnInit, OnDestroy {

  @Input() settings: any = null;

  dataMain: any = {};

  addRelationFormData: any = null;
  editedWorkItem: any = null;
  form: FormGroup = new FormGroup({}, null, null);
  formInit = false;
  searchResults: any[] = [];
  loadingFolderData = false;
  openFileItem: any = null;
  policyInfo: any = null;
  policyDocuments: any = null;
  relatedFiles: any[] = [];
  relatedTasks: any[] = [];
  searchMode = null;
  searchValue = null;
  showResetButton = false;

  // Subscriptions
  formChangesSub: Subscription | null = null;
  getAddRelationFormSub: Subscription | null = null;
  getRelatedFilesSub: Subscription | null = null;
  getRelatedTasksSub: Subscription | null = null;
  postAddRelationSub: Subscription | null = null;
  updateWorkLockedStatusSub: Subscription | null = null;

  constructor(
    @Inject('AUTH') public auth: any,
    public authService: AuthService,
    private boxService: BoxService,
    private fb: FormBuilder,
    private location: Location,
    public oktaAuth: OktaAuthService,
    private route: ActivatedRoute,
    private state: StateService,
    private workQueueService: WorkQueueService
  ) {
    this.route.queryParams.subscribe(params => {
    });
  }

  async ngOnInit() {
    this.state.dataMain.subscribe(result => {
      this.dataMain = result;
    });

    this.initForm();
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
    if (this.updateWorkLockedStatusSub && !this.updateWorkLockedStatusSub.closed) {
      this.updateWorkLockedStatusSub.unsubscribe();
    }
  }

  addRelation($event: any) {
    this.addRelationFormData = null;
    this.postAddRelationSub = this.workQueueService.PostAddRelation(this.searchResults[0]!.id, this.form.get('searchType')!.value, this.form.get('searchText')!.value, $event).subscribe(response => {

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

  getRelatedFiles() {
    this.getRelatedFilesSub = this.workQueueService.GetRelatedFiles(this.searchResults[0]!.id, this.form.get('searchType')!.value, this.form.get('searchText')!.value).subscribe(response => {
      this.relatedFiles = response.entries;
    });
  }

  getRelatedTasks() {
    // switch type by this.form.get('searchType')!.value
    this.getRelatedTasksSub = this.workQueueService.GetWorkQueue('policyNumber', this.form.get('searchText')!.value).subscribe(response => {
      this.relatedTasks = response.rows;
    });
  }

  getPolicyDocuments() {
    this.boxService.PostBoxMetaDataQueries(this.getMetaDataQuery('policyDocuments', this.form.get('searchText')!.value)).subscribe(response => {
      if (hasData(response) === true) {
        this.policyDocuments = response.entries.filter((item: any) => item.type === 'file');
      }
    });
  }

  initForm() {
    // 'MM1234567'
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

    this.searchFromUrl();

  }

  openAddRelation() {
    this.getAddRelationFormSub = this.workQueueService.GetWorkForm(14, 'FILE').subscribe(response => {
      this.addRelationFormData = response;
    });
  }

  refreshWorkQueue() {
    /*this.workQueueService.GetWorkQueue().subscribe(response => {
      this.dataMain.queue.data = response.rows;
      this.state.changeDataMain(this.dataMain);
    });*/
  }

  reset() {
    this.showResetButton = false;
    this.searchMode = null;
  }

  searchFromUrl() {
    const searchType = this.route.snapshot.params.searchType;
    const searchText = this.route.snapshot.params.searchText;
    if (hasData(searchType) === true && hasData(searchText) === true) {
      this.form.get('searchType')!.setValue(searchType);
      this.form.get('searchText')!.setValue(searchText);
      // this.submitSearch();
    }
  }

  submitSearch() {
    this.location.replaceState(`file-search/${this.form.get('searchType')!.value}/${this.form.get('searchText')!.value}`);
    this.boxService.PostBoxMetaDataQueries(this.getMetaDataQuery(this.form.get('searchType')!.value, this.form.get('searchText')!.value)).subscribe(response => {
      this.loadingFolderData = false;
      this.showResetButton = true;
      if (hasData(response) === true) {
        this.searchResults = response.entries;
        this.policyInfo = response.entries[0].metadata.enterprise_45486919.policyFolder;
        this.getRelatedTasks();
        this.getPolicyDocuments();
        this.getRelatedFiles();
      }
    });

  }

  updateLockedStatus(element: any, status: boolean) {
    this.updateWorkLockedStatusSub = this.workQueueService.PutWorkState(
      {
        itemId: element.itemId,
        lockedStatus: status,
        lockedBy: this.dataMain.user.email
      }
    ).subscribe(response => {
      this.getRelatedTasks();
    });
  }

  updateSearchMode($event: any) {
    this.searchMode = $event.value;
  }

}
