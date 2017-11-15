import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../../core/auth.service';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Component({
  selector: 'survey-results',
  templateUrl: './survey-results.component.html',
  styleUrls: ['./survey-results.component.scss']
})
export class SurveyResultsComponent implements OnInit {

  public doughnutChartLabels:string[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  public doughnutChartData:number[] = [350, 450, 100];
  public doughnutChartType:string = 'doughnut';

  public all_surveys;
  public current_survey;
  public current_survey_name;
  public current_survey_questions;

  public selected_question;
  public question_details_modal_boolean: boolean = false;

  constructor(private _authSrv: AuthService,
              private _router: Router,
              private _activeRoute: ActivatedRoute,
              private _afs: AngularFirestore) {}

  ngOnInit() {
    this._activeRoute.params.subscribe((params: Params) => {
      // Get current survey name from query params
      this.current_survey_name = params['survey_name'];
      this.getSurveyResults(this.current_survey_name);
      if(this._authSrv.all_surveys == null) {
        this._router.navigate(['dashboard']);
      } else {
        this.all_surveys = this._authSrv.all_surveys;
        console.log(this.all_surveys);
        for(var i = 0; i < this.all_surveys.length; i++) {
          // FIND the current survey, and store locally in component
          if(this.all_surveys[i]['postback'] == this.current_survey_name) {
            this.current_survey = this.all_surveys[i];
            this.current_survey_questions = this.current_survey['questions'];
            // ADDING COUNTS of Quick replies to each question
            for(var j = 0; j < this.current_survey_questions.length; j++) {
              this.current_survey['questions'][j]['quick_replies_length'] = this.current_survey['questions'][j]['quick_replies'].length;
              this.current_survey['questions'][j]['question_index'] = j+1;
            }
            console.log(this.current_survey);
          }
        }
      }
    })
  }

  getSurveyResults(survey_name) {
    console.log(survey_name);
    const collection = this._afs.collection('surveys');
    // const collection = this._afs.collection('responses').doc(survey_name).collection('users');
    const collection$ = collection.valueChanges();
    collection$.subscribe(data => {
        console.log(data);
    })

  }

  openQuestionDetailsModal(question) {
    console.log(question);

    this.question_details_modal_boolean = true;    
    this.selected_question = question;
  } 

  closeQuestionDetailsModal() {
    this.question_details_modal_boolean = false;
    this.selected_question = null;
  }

}
