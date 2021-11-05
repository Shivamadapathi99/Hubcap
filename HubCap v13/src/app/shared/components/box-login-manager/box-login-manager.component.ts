import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import * as moment from 'moment';

import { hasData } from '../../utilities/utilities';

import { StateModel } from '../../models/state.model';

import { BoxService } from '../../services/box.service';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-box-login-manager',
  templateUrl: './box-login-manager.component.html',
  styleUrls: ['./box-login-manager.component.scss']
})
export class BoxLoginManagerComponent implements OnInit, OnDestroy  {

  @Output() boxInitialized = new EventEmitter<any>();

  boxCode: string = '';
  boxRefreshTokenTimerDuration = 1000 * 60 * 60;
  dataMain: StateModel = new StateModel();
  dateNow: any = null;

  // Subscriptions
  getBoxTokenSub: Subscription | null = null;

  constructor(
    private boxService: BoxService,
    private route: ActivatedRoute,
    private router: Router,
    private state: StateService
  ) {
    this.dateNow = new Date().toISOString();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.boxCode = params['code'];
    });
    this.state.dataMain.subscribe(result => {
      this.dataMain = result;
      console.log('dataMain: ', this.dataMain);
    });
    this.initBoxAuthentication();
  }

  ngOnDestroy(): void {
    if (this.getBoxTokenSub && !this.getBoxTokenSub.closed) {
      this.getBoxTokenSub.unsubscribe();
    }
  //  this.getBoxTokenSub.unsubscribe();
  }

  deleteBoxTokens() {
    this.validateBoxTokens();
 //   this.boxService.DeleteBoxTokens(this.dataMain!.user!.email).subscribe(deleteBoxTokensResponse => {
   //   console.log('DELETE BOX TOKENS', deleteBoxTokensResponse);   
     // this.boxService.showBoxLogin();
    //});
  }

  initBoxAuthentication() {

    if (hasData(this.boxCode) === true) {
      this.boxService.PostBoxLogin(this.boxCode).subscribe(postBoxLoginResponse => {
        console.log(postBoxLoginResponse);
        const tokenData = {
          user_email: this.dataMain.user!.email,
          access_token: postBoxLoginResponse.access_token,
          refresh_token: postBoxLoginResponse.refresh_token
        };
        this.boxService.PostBoxTokens(this.dataMain.user!.email, tokenData).subscribe(postBoxTokensResponse => {
          console.log(postBoxTokensResponse);
          this.updateDataMainBoxTokens(postBoxLoginResponse.access_token, postBoxLoginResponse.refresh_token, this.dateNow, this.dateNow);
          this.boxInitialized.emit();
          this.router.navigate(['/']);
        });
      });
    } else {
      this.validateBoxTokens();
    }

  }

  initBoxRefreshTokenTimer() {
    setTimeout(() => {
      this.refreshToken();
      this.initBoxRefreshTokenTimer();
    }, this.boxRefreshTokenTimerDuration);
  }

  refreshToken() {
    if (moment(this.dateNow).isAfter(moment(this.dataMain.boxToken!.modifiedDate).add(60, 'minutes'))) {
      this.boxService.PostBoxRefreshToken({ refresh_token: this.dataMain.boxToken!.refreshToken }).subscribe(
        postBoxRefreshTokenResponse => {
          console.log('REFRESH TOKEN: ', postBoxRefreshTokenResponse);
          const tokenData = {
            user_email: this.dataMain.user!.email,
            access_token: this.dataMain.boxToken!.accessToken,
            refresh_token: this.dataMain.boxToken!.refreshToken
          };
          this.boxService.PutBoxTokens(this.dataMain.user!.email, tokenData).subscribe(putBoxTokensResponse => {
            console.log(putBoxTokensResponse);
            this.updateDataMainBoxTokens(postBoxRefreshTokenResponse.access_token, postBoxRefreshTokenResponse.refresh_token, postBoxRefreshTokenResponse.created_date, postBoxRefreshTokenResponse.modified_date);
            this.boxInitialized.emit();
          });
        },
        error => {
          console.log(error);
          if (error.error.error_description === 'Refresh token has expired') {
           this.deleteBoxTokens();
           
          }
        }
      );
    } else {
      this.boxInitialized.emit();
    }
  }

  updateDataMainBoxTokens(accessToken: string, refreshToken: string, createdDate: string, modifiedDate: string) {
    this.dataMain.boxToken = {
      accessToken: accessToken,
      refreshToken: refreshToken,
      createdDate: createdDate,
      modifiedDate: modifiedDate
    };
    this.state.changeDataMain(this.dataMain);
    this.initBoxRefreshTokenTimer();
  }

  validateBoxTokens() {
    this.getBoxTokenSub = this.boxService.GetBoxTokensFromDatabase(this.dataMain.user!.email).subscribe(getBoxTokensResponse => {
      console.log('GET BOX TOKENS FROM DATABASE', getBoxTokensResponse);
      if (getBoxTokensResponse.success === true) {
        const tokenStatus = this.boxService.validateBoxToken(getBoxTokensResponse.access_token, getBoxTokensResponse.refresh_token, getBoxTokensResponse.created_date, getBoxTokensResponse.modified_date);
        console.log('TOKEN STATUS: ', tokenStatus);
        this.updateDataMainBoxTokens(getBoxTokensResponse.access_token, getBoxTokensResponse.refresh_token, getBoxTokensResponse.created_date, getBoxTokensResponse.modified_date);
        switch (tokenStatus) {
          case 'valid':
            // this.boxInitialized.emit();
            this.refreshToken();
            break;
          case 'accessTokenExpired':
            this.refreshToken();
            break;
          case 'refreshTokenExpired':
            this.boxService.DeleteBoxTokens(this.dataMain!.user!.email).subscribe(deleteBoxTokensResponse => {
              this.boxService.showBoxLogin();
           });
        
            break;
          default:
        }
      } else {
        this.boxService.showBoxLogin();
      }
    });
  }

}
