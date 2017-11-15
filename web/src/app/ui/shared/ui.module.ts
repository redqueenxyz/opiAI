import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ChartsModule } from 'ng2-charts';

import { NavService } from './nav.service';

import { UserLoginComponent } from '../user-login/user-login.component';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { UserFormComponent } from '../user-form/user-form.component';
import { TopNavComponent } from '../top-nav/top-nav.component';
import { FooterNavComponent } from '../footer-nav/footer-nav.component';
import { ReadmePageComponent } from '../readme-page/readme-page.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { SurveyResultsComponent } from '../survey-results/survey-results.component';
import { SurveyResultsChartsComponent } from '../survey-results-charts/survey-results-charts.component';
import { CreateAsurveyComponent } from '../create-asurvey/create-asurvey.component';
import { CreateSurveyAdCreativeComponent } from '../create-survey-ad-creative/create-survey-ad-creative.component';



@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    BrowserAnimationsModule,
    ChartsModule
  ],
  declarations: [
    UserLoginComponent,
    UserProfileComponent,
    TopNavComponent,
    FooterNavComponent,
    UserFormComponent,
    ReadmePageComponent,
    DashboardComponent,
    SurveyResultsComponent,
    SurveyResultsChartsComponent,
    CreateAsurveyComponent,
    CreateSurveyAdCreativeComponent,
  ],
  exports: [
    TopNavComponent,
    FooterNavComponent,
    UserProfileComponent,
  ]
})
export class UiModule { }
