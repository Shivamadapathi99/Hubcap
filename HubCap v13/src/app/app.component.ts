
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from './shared/services/okta.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'HubCap';
  isAuthenticated: boolean = false;

  constructor(public oktaAuth: OktaAuthService) {
    // this.oktaAuth.$authenticationState.subscribe(isAuthenticated => this.isAuthenticated = isAuthenticated);
  }

  async ngOnInit() {
    // this.isAuthenticated = await this.oktaAuth.isAuthenticated();
    this.oktaAuth.$isAuthenticated.subscribe((val: boolean) => this.isAuthenticated = val);

  }

  // login() {
  //   this.oktaAuth.signInWithRedirect({
  //     originalUri: '/policy'
  //   });
  // }

  // logout() {
  //   this.oktaAuth.signOut('/');
  // }
}
