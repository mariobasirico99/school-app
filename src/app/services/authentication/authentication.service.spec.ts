import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { AuthenticationService } from './authentication.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FakeBackendInterceptor } from 'src/app/helpers/fake-backend';
import { LoginComponent } from 'src/app/components/login/login.component';

var appConfiguration = require('src/assets/config/appConfig.json');

describe('AuthenticationService', () => {
  let authenticationService: AuthenticationService;
  let fakeBackendInterceptor: HttpTestingController;

  let username: string = 'admin';
  let password: string = 'admin';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [LoginComponent],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: FakeBackendInterceptor,
          multi: true,
        },
      ],
    });

    authenticationService = TestBed.inject(AuthenticationService);
    fakeBackendInterceptor = TestBed.inject(HttpTestingController);

    let store: any = {};

    spyOn(localStorage, 'getItem').and.callFake((key: string): string => {
      return store[key] || null;
    });
    spyOn(localStorage, 'setItem').and.callFake(
      (key: string, value: string): string => {
        return (store[key] = <string>value);
      }
    );

    spyOn(authenticationService, 'redirectToLoginPage');
  });

  it('Login with Admin Account', (done: DoneFn) => {
    authenticationService.login(username, password).subscribe({
      next: (user) => {
        expect(user.id).withContext('Expected User Id').toBe(1);
        expect(localStorage.getItem('user')).toBe(
          JSON.stringify({
            id: 1,
            username: 'admin',
            role: 'Admin',
            token: 'fake-jwt-token.1',
          })
        );
        done();
      },
      error: done.fail,
    });
  });

  it('Logout user', () => {
    authenticationService.logout();
    expect(localStorage.getItem('user')).toBeNull();
    expect(authenticationService.redirectToLoginPage).toHaveBeenCalled();
  });

  it('Password With Encryption', () => {
    let CryptoJS = require('crypto-js');
    let encryptedPassword = authenticationService.processPassword(
      password,
      true
    );

    expect(toHex(password)).toBe(
      CryptoJS.AES.decrypt(
        encryptedPassword,
        appConfiguration.passwordEncryption.key
      ).toString()
    );
  });

  it('Password Without Encryption', () => {
    let encryptedPassword = authenticationService.processPassword(
      password,
      false
    );
    expect(encryptedPassword).toBe(password);
  });
});

function toHex(string: string) {
  var result = '';
  for (var i = 0; i < string.length; i++) {
    result += string.charCodeAt(i).toString(16);
  }
  return result;
}
