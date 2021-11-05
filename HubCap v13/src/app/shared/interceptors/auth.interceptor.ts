import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, from, Observable, throwError } from 'rxjs';
import { catchError, delay, filter, finalize, switchMap, take, tap } from 'rxjs/operators';
import * as moment from 'moment';

import { AuthService } from '../services/auth.service';
import { BoxService } from '../services/box.service';
import { StateService } from '../services/state.service';
import { WorkQueueService } from '../services/work-queue.service';

import { hasData } from '../utilities/utilities';

import { StateModel } from '../models/state.model';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  dataMain: StateModel = new StateModel();

  constructor(
    @Inject('AUTH')
    public auth: any,
    private boxService: BoxService,
    private router: Router,
    private state: StateService,
    private authService: AuthService,
    private workQueueService: WorkQueueService) {

    this.state.dataMain.subscribe(result => {
      this.dataMain = result;
    });

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    /*const tokens = this.boxService.getBoxTokens();
    return next.handle(this.getRequest(request, tokens));*/

    let tokens = this.boxService.getBoxTokens();
    const now = moment(new Date());

    let authReq = request;
    if (tokens!.accessToken !== null) {
      authReq = this.getRequest(request, tokens);
    }

    return next.handle(authReq).pipe(catchError(error => {
      console.log('AN ERROR HAS OCCURRED', error);

      if (error.error.error_description === 'Refresh token has expired') {
        console.log('REFRESH TOKEN HAS EXPIRED', tokens);
        this.boxService.DeleteBoxTokens(this.dataMain.user!.email);
        this.boxService.showBoxLogin();
      }
      if (error.error.error_description === 'The authorization code has expired' || error.status === 401 || error.status === 0) {
        console.log('AUTHORIZATION TOKEN HAS EXPIRED', tokens, now.isAfter(moment(tokens!.modifiedDate).add(1, 'hours')));
        return this.handle401Error(authReq, next);
      }
      return throwError(error);
    }));
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    console.log('handle401Error');
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      let tokens = this.boxService.getBoxTokens();

      return this.authService.refreshToken({ refresh_token: tokens!.refreshToken }).pipe(
        switchMap((response: any) => {

          this.isRefreshing = false;

          tokens = {
            accessToken: response.access_token,
            refreshToken: response.refresh_token,
            createdDate: response.created_date,
            modifiedDate: response.modified_date
          };

          this.boxService.PutBoxTokens(
            this.dataMain.user!.email,
            {
              user_email: this.dataMain.user!.email,
              access_token: response.access_token,
              refresh_token: response.refresh_token
            }
          );
          this.refreshTokenSubject.next(tokens);

          return next.handle(this.getRequest(request, tokens));
        }),
        catchError((err) => {
          this.isRefreshing = false;
          this.boxService.DeleteBoxTokens(this.dataMain.user!.email).subscribe(response => {
            this.boxService.showBoxLogin();
          });
          return throwError(err);
        })
      );
    }

    return this.refreshTokenSubject.pipe(
      filter(tokens => tokens !== null),
      take(1),
      switchMap((tokens) => next.handle(this.getRequest(request, tokens)))
    );
  }

  getRequest(request: any, tokens: any) {
    // const tokens = this.boxService.getBoxTokens();

    if (hasData(tokens!.accessToken) === true) {
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + tokens!.accessToken
        }
      });
    }

    if (!request.headers.has('Content-Type')) {
      request = request.clone({
        setHeaders: {
          'content-type': 'application/json'
        }
      });
    }

    request = request.clone({
      headers: request.headers.set('Accept', 'application/json')
    });

    return request;
  }
}
