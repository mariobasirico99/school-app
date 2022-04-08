import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

/**
 * It intercepts HTTP Requests with purpose to detect errors.
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  /**
   * @param authenticationService Refer to {@link AuthenticationService}
   */
  constructor(private authenticationService: AuthenticationService) {}

  /**
   * It intercepts the request and search for a possible error code.
   * @param request
   * @param next
   * @returns Throw an error (with error message and status from http response) if detected.
   */
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if ([401, 403].indexOf(err.status) !== -1) {
          // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
          this.authenticationService.logout();
        }

        const error = err.error.message || err.statusText;
        return throwError(() => new Error(error));
      })
    );
  }
}
