import { Observable, Observer } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  OktaAuth,
  OktaAuthOptions,
  TokenManager,
  AccessToken,
  IDToken,
  TokenParams,
  isToken,
  getUserInfo
} from '@okta/okta-auth-js';
import { Inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class OktaAuthService {

  userClaims: any;
  $isAuthenticated: Observable<boolean>;
  private observer?: Observer<boolean>;

  constructor(
    private router: Router,
    @Inject('OKTA_CONFIG')
    public oktaConfig: any
  ) {
    this.$isAuthenticated = new Observable((observer: Observer<boolean>) => {
      this.observer = observer;
      this.isAuthenticated().then(val => {
        observer.next(val);
      });
    });
  }

  oktaAuth = new OktaAuth(this.oktaConfig);

  async isAuthenticated() {
    return !!(await this.oktaAuth.tokenManager.get('accessToken'));
  }

  async getUser(): Promise<any> {
    this.userClaims = JSON.parse(sessionStorage.getItem('okta-token-storage')!).idToken.claims;
    return this.userClaims;
  }

  login(originalUrl: string) {
    // Save current URL before redirect
    sessionStorage.setItem('okta-app-url', originalUrl || this.router.url); ``

    // Launches the login redirect.
    this.oktaAuth.token.getWithRedirect({
      scopes: ['openid', 'email', 'profile']
    });
  }

  async handleAuthentication() {
    const tokenContainer = await this.oktaAuth.token.parseFromUrl();

    this.oktaAuth.tokenManager.setTokens(tokenContainer.tokens);

    if (await this.isAuthenticated()) {
      this.observer?.next(true);
    }

    // Retrieve the saved URL and navigate back
    const url = sessionStorage.getItem('okta-app-url') as string;
    this.router.navigateByUrl(url);
  }

  async logout() {
    await this.oktaAuth.signOut({
      postLogoutRedirectUri: '/'
    });
  }
}

function getUser() {
  throw new Error('Function not implemented.');
}

