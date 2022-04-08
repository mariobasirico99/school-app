import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { Path } from '../enum/path';

/**
 * It's used for security purposes. It checks if the current user is authorized to navigate
 * to a specific route, based on authentication and role check.
 */
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  /**
   * @param router A service that provides navigation among views and URL manipulation capabilities
   * @param authenticationService Refer to {@link AuthenticationService}
   */
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  /**
   * Decide if a route can be activated based on authentication and role check. If user is not logged
   * in (user == null), then it is redirected to login page. If it is logged and his role can access
   * the route, then the route is activated, otherwise it is redirected to "/" path.
   * @param route
   * @param state
   * @returns Check status. ```true``` if autorized, ```false``` if not
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const user = this.authenticationService.userValue;
    // If user is present in authentication service
    if (user && Object.keys(user!).length !== 0) {
      // If roles exist and is not present in user role
      if (
        route.data['roles'] &&
        route.data['roles'].indexOf(user!.role) === -1
      ) {
        // Role not authorized so redirect to home page
        this.router.navigate(['/']);
        return false;
      }
      // Else Role authorised so return true
      return true;
    }

    // Else user is not logged in so redirect to login page with the return url
    this.router.navigate([Path.Login], {
      queryParams: { returnUrl: state.url }, //It's used for redirect to searched page after login
    });
    return false;
  }
}
