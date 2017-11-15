import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'create-asurvey',
  templateUrl: './create-asurvey.component.html',
  styleUrls: ['./create-asurvey.component.scss']
})
export class CreateAsurveyComponent implements OnInit {

  public survey_title: string;
  public survey_description: string;

  constructor(private _router: Router) { }

  ngOnInit() {
  }

  submitAd() {
    console.log(this.survey_title);
    this._router.navigate(['create-a-survey/ad-creative']);
    
  }
}
