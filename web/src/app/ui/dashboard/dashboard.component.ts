import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public surveys_first_row = [];
  public surveys_all_rows = [];
  public surveys_counter = 0;

  constructor(private _authSrv: AuthService,
              private _router: Router,
              private _afs: AngularFirestore) {}

  ngOnInit() {
    if(this._authSrv.authState == null) {
      this._router.navigate(['login']);
    } else {
      // Initialize the component
      // var docRef = this._afs.collection("surveys").ref;
      // docRef.get().then(function(querySnap) {
      //   querySnap.forEach(function(doc) {
      //     console.log(doc.data());
      //   })
      // })

      const collection = this._afs.collection('surveys');
      const collection$ = collection.valueChanges();
      collection$.subscribe(data => {
        // console.log(data);
        this._authSrv.all_surveys = data;
        

        for(var i = 0; i < data.length; i++) {
          console.log(data[i]['postback']);
          var someVal = data[i]['postback'].toString().split('_').join(' ').toUpperCase();
          data[i]['survey_name'] = someVal;
          console.log(data[i]);
          if(i == 0 || i == 1) {
            this.surveys_first_row.push(data[i])
          } else {
            this.surveys_all_rows.push(data[i])
          }
        }
      })
    }
  }
}