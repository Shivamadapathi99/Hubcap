import { Injectable } from '@angular/core';
import { Inject } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import * as moment from 'moment';

import { SearchQueryModel } from './../models/search-query.model';
import { StateModel } from '../models/state.model';

import { AuthService } from '../services/auth.service';
import { StateService } from '../services/state.service';

import { API_BASE_PATH } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class BoxService {

  private boxTokenUrl = 'https://api.box.com/oauth2/token';
  dataMain: StateModel = new StateModel();

  constructor(
    @Inject('AUTH')
    public auth: any,
    private authService: AuthService,
    private http: HttpClient,
    private state: StateService
  ) {
    this.state.dataMain.subscribe(result => {
      this.dataMain = result;
    });
  }

  DeleteBoxTokens(userEmail: any): Observable<any> {
    return this.http.delete<any>(`${API_BASE_PATH}box/info?emailAddress=${userEmail}`);
  }

  GetBoxExpiringEmbedLink(fileId: string): Observable<any> {
    return this.http.get<any>(`https://api.box.com/2.0/files/${fileId}?fields=expiring_embed_link&showAnnotations=true`);
  }

  GetBoxFolder(folderId: string): Observable<any> {
    return this.http.get<any>(`https://api.box.com/2.0/folders/${folderId}/items/`);
  }

  GetBoxFileInfo(fileId: string): Observable<any> {
    return this.http.get<any>(`https://api.box.com/2.0/files/${fileId}`);
  }

  GetBoxSearch(foldername: string): Observable<SearchQueryModel> {
    const tokens = this.getBoxTokens();
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + tokens!.accessToken);
    return this.http.get<SearchQueryModel>(`https://api.box.com/2.0/search?query=${foldername}&type=folder`, { headers });
  }

  GetBoxTokensFromDatabase(userEmail: any): Observable<any> {
    return this.http.get<any>(`${API_BASE_PATH}box/info?emailAddress=${userEmail}`);
  }

  PostBoxLogin(code: string): Observable<any> {
    return this.http.post<any>(this.boxTokenUrl, {
      grant_type: 'authorization_code',
      code: code,
      client_id: this.auth['clientId'],
      client_secret: this.auth['clientSecret']
    });
  }

  PostBoxMetaDataQueries(data: any): Observable<any> {
    return this.http.post<any>(`https://api.box.com/2.0/metadata_queries/execute_read`, data);
  }

  PostBoxRefreshToken(data: any): Observable<any> {
    return this.http.post<any>(this.boxTokenUrl, {
      client_id: this.auth['clientId'],
      client_secret: this.auth['clientSecret'],
      refresh_token: data.refresh_token,
      grant_type: 'refresh_token',
    });
  }

  PostBoxTokens(userEmail: any, data: any): Observable<any> {
    return this.http.post<any>(`${API_BASE_PATH}box/info?emailAddress=${userEmail}`, data);
  }

  PutBoxFileNameUpdate(id: any, data: any, tokens: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + tokens!.accessToken);
    return this.http.put<any>(`https://api.box.com/2.0/files/${id}`, data, { headers });
  }

  PutBoxFileParentUpdate(id: any, data: any, tokens: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + tokens!.accessToken);
    return this.http.put<any>(`https://api.box.com/2.0/files/${id}`, data, { headers });
  }

  PutBoxTokens(userEmail: any, data: any): Observable<any> {
    return this.http.put<any>(`${API_BASE_PATH}box/info?emailAddress=${userEmail}`, data);
  }

  getBoxTokens() {
    return this.dataMain.boxToken;
  }

  uploadDocuments(data: any): Observable<any> {
    return this.http.post<any>(`https://ym07vn9fp5.execute-api.us-east-1.amazonaws.com/v1/admin/file`, data);
  }

  showBoxLogin() {
    window.location.href = this.auth['domain'] + '?client_id=' + this.auth['clientId'] + '&response_type=code';
  }

  validateBoxToken(accessToken: string, refreshToken: string, created_date: string, modified_date: string) {
    const today = moment(new Date());
    const accessTokenExpiration = moment(modified_date).add(1, 'hours');
    const refreshTokenExpiration = moment(created_date).add(59, 'days');
    let result = 'valid';
    if (today.isAfter(refreshTokenExpiration)) {
      result = 'refreshTokenExpired';
    } else {
      if (today.isAfter(accessTokenExpiration)) {
        result = 'accessTokenExpired';
      }
    }
    return result;
  }
}
