import { Component, Inject, OnDestroy, OnInit, AfterContentInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OktaAuthService } from '../../services/okta.service';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

import { AuthService } from '../../services/auth.service';
import { BoxService } from '../../services/box.service';
import { StateService } from '../../services/state.service';
import { WorkQueueService } from '../../services/work-queue.service';

import { StateModel, QuickLinksModel } from '../../models/state.model';
import { MatTabGroup } from '@angular/material/tabs';

import { TABS_MAIN } from '../../constants/constants';
import { hasData } from '../../utilities/utilities';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy, AfterContentInit {

  @ViewChild('tabs', { static: false }) tabGroup: MatTabGroup | null = null;

  boxCode: string = '';
  boxLoginStatus: boolean = false;
  boxToken: any = {
    accessToken: null,
    refreshToken: null,
    modifiedDate: null
  };
  dataMain: StateModel = new StateModel();
  refreshWorkQueueDataInterval = 60000;
  refreshWorkQueueDataTimer: any = null;
  selectedTabIndex = 0;
  workQueueRefreshing = false;

  // Subscriptions
  getBoxTokenSub: Subscription | null = null;
  getTeamQueueSub: Subscription | null = null;
  refreshWorkQueueSub: Subscription | null = null;

  constructor(
    @Inject('AUTH') public auth: any,
    public authService: AuthService,
    private boxService: BoxService,
    private location: Location,
    public oktaAuth: OktaAuthService,
    private route: ActivatedRoute,
    private router: Router,
    private state: StateService,
    private workQueueService: WorkQueueService
  ) {

  }

  ngAfterContentInit() {
    this.selectTabFromRoute();
  }

  async ngOnInit() {

    const user = await this.oktaAuth.getUser().then((user) => {
      this.dataMain.user = user;
      this.state.changeDataMain(this.dataMain);
    });

  }

  ngOnDestroy() {
    if (this.getBoxTokenSub && !this.getBoxTokenSub.closed) {
      this.getBoxTokenSub.unsubscribe();
    }
    if (this.getTeamQueueSub && !this.getTeamQueueSub.closed) {
      this.getTeamQueueSub.unsubscribe();
    }
    if (this.refreshWorkQueueSub && !this.refreshWorkQueueSub.closed) {
      this.refreshWorkQueueSub.unsubscribe();
    }
  }

  getAllWork() {
    this.workQueueService.GetWorkQueue().subscribe(response => {
      this.dataMain.queue.columnTitles = response.columns.map((item: any) => (item.title));
      this.dataMain.queue.data = response.rows;
      this.dataMain.queue.pipes = response.columns.map((item: any) => '');
      this.dataMain.queue.displayColumns = response.columns.map((item: any) => (item.fieldName));
      this.dataMain.queue.displayColumns.unshift('edit');
      this.state.changeDataMain(this.dataMain);
    });
  }

  init() {

    this.route.queryParams.subscribe(params => {
      this.boxCode = params['code'];
    });

    this.state.dataMain.subscribe(result => {
      this.dataMain = result;
      console.log('dataMain: ', this.dataMain);
    });

    this.getAllWork();
    this.initAutoRefreshWorkQueueData();

    this.boxLoginStatus = true;
  }

  initAutoRefreshWorkQueueData() {
    this.refreshWorkQueueDataTimer = setInterval(() => {
      this.refreshWorkQueue();
    }, this.refreshWorkQueueDataInterval);
  }

  openQuickLink(quickLink: QuickLinksModel) {
    window.open(quickLink.url, quickLink.windowTarget);
  }

  refreshWorkQueue() {
    if (this.workQueueRefreshing === false) {
      this.workQueueRefreshing = true;
      this.refreshWorkQueueSub = this.workQueueService.GetWorkQueue().subscribe(response => {
        this.workQueueRefreshing = false;
        this.dataMain.queue.data = response.rows;
        this.state.changeDataMain(this.dataMain);
      });
    }
  }

  selectTabFromRoute() {
    if (this.route.snapshot.url.length > 0) {
      const path = this.route.snapshot.url[0].path;
      this.selectedTabIndex = TABS_MAIN.findIndex((item: string) => item === path);
    }
  }

  tabChanged($event: any) {
    this.location.replaceState(TABS_MAIN[$event.index]);
  }

}
