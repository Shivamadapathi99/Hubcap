import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SMARTSHEET_SETTINGS } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class SmartsheetService {

  sheetUrl = `${SMARTSHEET_SETTINGS.smartsheetUrl}`;
  queueUrl = `${SMARTSHEET_SETTINGS.smartsheetUrl}/sheets/${SMARTSHEET_SETTINGS.queueSheetId}/rows/`;
  packageUrl = `${SMARTSHEET_SETTINGS.smartsheetUrl}/sheets/${SMARTSHEET_SETTINGS.packageSheetId}/rows/`;

  constructor(
    private http: HttpClient
  ) { }

  GetTeamQueue(): Observable<any> {
    return this.http.get<any>(`${this.sheetUrl}`);
  }

  GetPackage(id: string): Observable<any> {
    return this.http.get<any>(`${this.packageUrl}` + id);
  }

  GetQueue(id: string): Observable<any> {
    return this.http.get<any>(`${this.queueUrl}` + id);
  }
}
