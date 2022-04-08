import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

/**
 * It intercepts HTTP Requests with purpose to add JWT Authentication Token to request.
 */
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  /**
   * @param authenticationService Refer to {@link AuthenticationService}.
   */
  constructor(private authenticationService: AuthenticationService) {}

  /**
   * It intercepts the request to add JWT Token iff user is logged in and the request is
   * for {@link environment} ```apiUrl```. It clones the intercepted request and add
   * the Authorization Header with ```Bearer + jwtToken```.
   * @param request
   * @param next
   * @returns If condition is respected, a new request with Authorization Header, otherwise
   * the same request without authorization.
   */
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Add auth header with jwt if user is logged in and request is to Api Url
    const user = this.authenticationService.userValue;
    const isLoggedIn = user && user.token;
    const isApiUrl = request.url.startsWith(environment.apiUrl);
    if (isLoggedIn && isApiUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${user.token}`,
        },
      });
    }
    // If user is not logged in or we are not searching for Api Url, we have same request as before
    return next.handle(request);
  }
}
