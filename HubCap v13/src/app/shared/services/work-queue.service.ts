import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_PATH } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class WorkQueueService {

  constructor(private http: HttpClient) { }

  GetWorkQueue(queryType: any = null, queryValue: any = null): Observable<any> {
    const queryString = queryType !== null && queryValue !== null ? `?${queryType}=${queryValue}` : '';
    return this.http.get<any>(`${API_BASE_PATH}work-items${queryString}`);
  }

  GetWorkQueueItemHistory(instanceId: any): Observable<any> {
    return this.http.get<any>(`${API_BASE_PATH}workflow/${instanceId}/history`);
  }

  GetWorkForm(id: number, formType: string): Observable<any> {
    return this.http.get<any>(`${API_BASE_PATH}form/${id}?formType=${formType}`);
  }

  GetWorkFormTypes(): Observable<any> {
    return this.http.get<any>(`${API_BASE_PATH}workflow`);
  }

  GetRelatedFiles(boxId: string, businessKey: string, businessValue: string): Observable<any> {
    return this.http.get<any>(`${API_BASE_PATH}file/${boxId}/relation?businessKey=${businessKey}&businessValue=${businessValue}`);
  }

  PostAddRelation(boxId: string, businessKey: string, businessValue: string, data: any): Observable<any> {
    return this.http.post<any>(`${API_BASE_PATH}file/${boxId}/relation?businessKey=${businessKey}&businessValue=${businessValue}`, data);
  }

  PostWorkForm(data: any): Observable<any> {
    return this.http.post<any>(`${API_BASE_PATH}workflow`, data);
  }

  PutWorkEditForm(data: any): Observable<any> {
    return this.http.put<any>(`${API_BASE_PATH}work-item`, data);
  }

  PutWorkState(data: any): Observable<any> {
    return this.http.put<any>(`${API_BASE_PATH}work-item/state`, data);
  }

}
