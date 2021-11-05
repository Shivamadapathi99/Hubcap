import { Component, OnInit, ViewChild } from '@angular/core';

import { StateService } from '../../services/state.service';

import { StateModel } from './../../models/state.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild('chart') chart: any;

  dataMain: StateModel = new StateModel();

  constructor(private state: StateService) {

  }

  ngOnInit(): void {
    this.state.dataMain.subscribe(result => {
      this.dataMain = result;
    });
  }

}
