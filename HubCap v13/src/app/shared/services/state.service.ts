import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { StateModel } from '../models/state.model';

@Injectable()

export class StateService {
  private dataMainSource = new BehaviorSubject<StateModel>(new StateModel());
  dataMain = this.dataMainSource.asObservable();
  dataMainLocal: StateModel = new StateModel();

  constructor() {
    this.initDataMainLocal();
  }

  changeDataMain(dataMain: any) {
    this.dataMainSource.next(dataMain);
  }

  initDataMainLocal() {
    const dataMain = this.dataMainLocal;
    /*dataMain.boxToken = {
      accessToken: null,
      refreshToken: null
    };*/
    dataMain.dashboard.quickLinks = [
      {
        title: 'Billing',
        url: '',
        windowTarget: '_blank'
      },
      {
        title: 'Claims',
        url: '',
        windowTarget: '_blank'
      },
      {
        title: 'PowerBI',
        url: '',
        windowTarget: '_blank'
      },
      {
        title: 'Dragon',
        url: 'https://drgprd.capspecialty.com/',
        windowTarget: '_blank'
      },
      {
        title: 'SBS',
        url: '',
        windowTarget: '_blank'
      },
    ];
    dataMain.queue = {
      columnTitles: [],
      data: [],
      displayColumns: [],
      pipes: [],
      rawData: []
    };

    this.dataMainLocal = dataMain;
    this.changeDataMain(this.dataMainLocal);
  }
}
