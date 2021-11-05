
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject } from '@angular/core';

import { BoxService } from './box.service';
import { StateService } from '../services/state.service';

import { StateModel } from '../models/state.model';
import { hasData } from '../utilities/utilities';


@Injectable()
export class AuthService {

  AccessToken: string = "";
  dataMain: StateModel = new StateModel();
  redirectUrl = '';

  private TokenAPI = 'https://api.box.com/oauth2/token';

  constructor(
    @Inject('AUTH')
    public auth: any,
    private http: HttpClient,
    private state: StateService,
    public boxService: BoxService
  ) {
    this.state.dataMain.subscribe(result => {
      this.dataMain = result;
    });
  }

  private static handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }

  login(code: string): Observable<any> {
    return this.http.post<any>(this.TokenAPI, {
      grant_type: 'authorization_code',
      code: code,
      client_id: this.auth['clientId'],
      client_secret: this.auth['clientSecret']
    });
  }

  refreshToken(refreshData: any): Observable<any> {
    console.log('REFRESH TOKEN', refreshData);
    return this.http.post<any>(this.TokenAPI, {
      client_id: this.auth['clientId'],
      client_secret: this.auth['clientSecret'],
      refresh_token: refreshData.refresh_token,
      grant_type: 'refresh_token',
    });
  }

  isLoggedIn() {
    const tokens = this.boxService.getBoxTokens();
    return hasData(tokens!.accessToken) === true ? true : false;
  }

}
