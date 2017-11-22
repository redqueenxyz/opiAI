import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';
// import 'chart.js'

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Component({
  selector: 'survey-results-charts',
  templateUrl: './survey-results-charts.component.html',
  styleUrls: ['./survey-results-charts.component.scss']
})
export class SurveyResultsChartsComponent implements OnInit {

  // GRAPH STUFFS
  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels:string[]; // INSTANTIATE IN CONST
  public barChartType:string = 'bar';
  public barChartLegend:boolean = true;
 
  public barChartData:any[]; // INSTANTIATE IN CONST

  public showChart = false;

  @Input() chartData;

  constructor(private _authSrv: AuthService,
              private _router: Router,
              private _afs: AngularFirestore) 
  {

    console.log(this.chartData);
    // var some = [
    //   { data: this.chart_data, label: "Answers" },
    // ];
    console.log(this.chartData);
    this.barChartData = this.chartData[0];
    this.barChartLabels = this.chartData[1];
    this.showChart = true;
  }

  ngOnInit() {
  }

}
