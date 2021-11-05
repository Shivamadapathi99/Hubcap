import { Component, OnInit, ViewChild } from '@angular/core';

import { StateService } from '../../services/state.service';

import { StateModel } from './../../models/state.model';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle
} from 'ng-apexcharts';

@Component({
  selector: 'app-dashboard-temp',
  templateUrl: './dashboard-temp.component.html',
  styleUrls: ['./dashboard-temp.component.scss']
})
export class DashboardTempComponent implements OnInit {

  @ViewChild('chart') chart: any;

  dataMain: StateModel = new StateModel();

  chartColors: any[] = [
    '#3cc6ed',
    '#99ca3c',
    '#172b54',
    '#f8981d',
    '#8896cc',
    '#eb486a'
  ];
  workIntakeByChannelPolicyActionsOptions: any;
  workIntakeByChannelChartOptions: any;

  constructor(private state: StateService) {
    this.workIntakeByChannelChartOptions = {
      colors: this.chartColors,
      series: [44, 35, 13, 43, 22, 20],
      chart: {
        type: 'pie',
        height: 200
      },
      labels: ['Submissions', 'Binders', 'Renewals', 'Loss Runs', 'Audits', 'Service']
    };
    this.workIntakeByChannelPolicyActionsOptions = {
      colors: this.chartColors,
      series: [50, 50],
      chart: {
        type: 'pie',
        height: 200
      },
      labels: ['Email', 'Mail'],
      legend: {
        show: false
      }
    };
  }

  ngOnInit(): void {
    this.state.dataMain.subscribe(result => {
      this.dataMain = result;
    });
  }

}
