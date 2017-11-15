import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent implements OnInit {

  show = false;
  isLoggedIn: boolean = false;

  constructor(private _authSrv: AuthService,
              private _router: Router) { }

  ngOnInit() {
    this._authSrv.authChange.subscribe(res => {
      // console.log(res);
      if (res) {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    })
  }

  toggleCollapse() {
    this.show = !this.show
  }

  logout() {
    this._authSrv.signOut();
    this._router.navigate(['login']);
  }

}
