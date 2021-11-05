import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpResponse, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import * as moment from 'moment';
import { hasData } from '../utilities/utilities';
import { catchError, finalize, map, tap } from 'rxjs/operators';

@Injectable()
export class BoxApiInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private cookieService: CookieService
  ) {

  }

  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(httpRequest).pipe(
      tap(
        event => {
        },
        error => {

        }
      ),
      finalize(() => {

      })
    );

  }
}
