import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/auth.guard';

import { UserLoginComponent } from './ui/user-login/user-login.component';
import { ItemsListComponent } from './items/items-list/items-list.component';
import { ReadmePageComponent } from './ui/readme-page/readme-page.component';
import { NotesListComponent } from './notes/notes-list/notes-list.component';
import { DashboardComponent } from './ui/dashboard/dashboard.component';
import { SurveyResultsComponent } from './ui/survey-results/survey-results.component';
import { CreateAsurveyComponent } from './ui/create-asurvey/create-asurvey.component';
import { CreateSurveyAdCreativeComponent } from './ui/create-survey-ad-creative/create-survey-ad-creative.component';

import { CoreModule } from './core/core.module'

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  { path: 'login', component: UserLoginComponent, },

  { path: 'dashboard', component: DashboardComponent },
  { path: 'survey-results/:survey_name', component: SurveyResultsComponent },
  { path: 'create-a-survey', component: CreateAsurveyComponent },
  { path: 'create-a-survey/ad-creative', component: CreateSurveyAdCreativeComponent },

  { path: 'items', component: ItemsListComponent, canActivate: [AuthGuard]},
  { path: 'notes', component: NotesListComponent,  canActivate: [AuthGuard] },
  // uploads are lazy loaded
  { path: 'uploads', loadChildren: './uploads/shared/upload.module#UploadModule', canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
