import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private _authSrv: AuthService,
              private _router: Router) {}

  ngOnInit() {
    if(this._authSrv.authState == null) {
      this._router.navigate(['login']);
    } else {
      // Initialize the component

      
      
    }

    
  
  }

}
