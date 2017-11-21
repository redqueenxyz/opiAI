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

  // GRAPH VARS
  public chart_data;
  public chart_labels;
  public chartData;


  // SURVEY VARS
  public all_surveys;
  public current_survey;
  public current_survey_name;
  public current_survey_questions;

  public survey_responses = {};

  public selected_question;
  public question_details_modal_boolean: boolean = false;

  // STATS
  public num_of_responses;
  public num_of_questions;

  constructor(private _authSrv: AuthService,
              private _router: Router,
              private _activeRoute: ActivatedRoute,
              private _afs: AngularFirestore) {}

  ngOnInit() {
    this._activeRoute.params.subscribe((params: Params) => {
      // Get current survey name from query params
      this.current_survey_name = params['survey_name'];
      // this.getSurveyResults(this.current_survey_name);
      if(this._authSrv.all_surveys == null) {
        this._router.navigate(['dashboard']);
      } else {
        this.all_surveys = this._authSrv.all_surveys;
        // console.log(this.all_surveys);
        for(var i = 0; i < this.all_surveys.length; i++) {
          // FIND the current survey, and store locally in component
          if(this.all_surveys[i]['postback'] == this.current_survey_name) {
            this.current_survey = this.all_surveys[i];
            this.current_survey_questions = this.current_survey['questions'];
            // ADDING COUNTS of Quick replies to each question
            this.num_of_questions = this.current_survey_questions.length;
            for(var j = 0; j < this.current_survey_questions.length; j++) {
              this.current_survey['questions'][j]['quick_replies_length'] = this.current_survey['questions'][j]['quick_replies'].length;
              this.current_survey['questions'][j]['question_index'] = j+1;
              this.getSurveyResults(this.current_survey_name, j.toString());
            }
            // console.log(this.current_survey);
          }
        }
      }
    })
  }

  getSurveyResults(survey_name, question_number) {
    const responses = this._afs
      .collection("responses")
      .doc(survey_name)
      .collection("questionAnswered")
      .doc(question_number)
      .collection("respondents")
      .valueChanges()
      .subscribe(data => {
        console.log("Survey: ", survey_name, ", question: ", question_number);
        console.log('Data: ', data);

        this.survey_responses[question_number] = data;

        // if first question, do a count of the data arrary
        if(question_number == '0') {
          this.num_of_responses = data.length;
        }
      })

  }

  openQuestionDetailsModal(question) {
    console.log(question);
    console.log(this.survey_responses);
    var resp_arr = this.survey_responses[question['question_index'] - 1];
    var resp_obj = {};
    console.log(resp_arr);

    for(var i = 0; i < resp_arr.length; i++) {
      if(!resp_obj[resp_arr[i]['answer']]) {
        resp_obj[resp_arr[i]['answer']] = [true];
      } else {
        resp_obj[resp_arr[i]['answer']].push(true);
      }
    }

    for(var key in resp_obj) {
      var daArr = resp_obj[key];
      resp_obj[key] = daArr.length;
    }

    console.log(resp_obj);

    var label_arr = Object.keys(resp_obj);
    var result_arr = [];
    for(var key in resp_obj) {
      result_arr.push(resp_obj[key]);
    }

    this.chart_data = result_arr;
    this.chart_labels = label_arr;

    console.log(this.chart_data);
    console.log(this.chart_labels);
    this.chartData = [this.chart_data, this.chart_labels];
    this.question_details_modal_boolean = true;    
    this.selected_question = question;
  } 

  closeQuestionDetailsModal() {
    this.question_details_modal_boolean = false;
    this.selected_question = null;
  }

}
