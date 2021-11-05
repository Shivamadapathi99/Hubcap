import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';

import { hasData } from '../../utilities/utilities';

import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-file-search',
  templateUrl: './file-search.component.html',
  styleUrls: ['./file-search.component.scss']
})
export class FileSearchComponent implements OnInit, OnDestroy {

  dataMain: any = {};
  openSearchResultNum = 0;
  selectedSearchResults = [
    {
      type: 'policyNumber',
      policyNumber: 'MM1234567'
    },
    {
      type: 'policyNumber',
      policyNumber: 'MM1234567'
    },
    {
      type: 'policyNumber',
      policyNumber: 'MM1234567'
    }
  ]

  constructor(
    private state: StateService
  ) { }

  async ngOnInit() {
    this.state.dataMain.subscribe(result => {
      this.dataMain = result;
    });
  }

  ngOnDestroy() {

  }

}
