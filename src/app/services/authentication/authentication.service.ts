import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {BehaviorSubject, filter, Observable} from 'rxjs';
import { User } from 'src/app/models/user';
import { Path } from 'src/app/enum/path';
var appConfiguration = require('../../../assets/config/appConfig.json');

import {IpcRenderer} from 'electron';
import { Shell} from 'electron';
declare global {
  interface Window {
    require: (module: 'electron') => {
      ipcRenderer: IpcRenderer
      shell: Shell
    };
  }
}
var CryptoJS = require('crypto-js');
const { ipcRenderer } = window.require('electron');

/**
 * It's used for authentication purposes. It saves data from the authentication endpoint to local storage for future usage.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  /**
   * It emits data to components that subscribe to it. It can also subscribe to other observables.
   */
  public userSubject: BehaviorSubject<User | null>;
  /**
   * It emits data to components that subscribe to it. It cannot subscribe to other observables.
   */
  public user: Observable<User | null>;

  /**
   * Initialize {@link userSubject} and {@link user} with local storage data about user if present.
   * Otherwise they will be null.
   * @param router A service that provides navigation among views and URL manipulation capabilities
   * @param http A service that provides methods for http requests.
   */
  constructor(private router: Router) {
    this.userSubject = new BehaviorSubject<User | null>(
      JSON.parse(localStorage.getItem('user')!)
    );
    this.user = this.userSubject.asObservable();
  }

  /**
   * Get user data from {@link userSubject} observable.
   * @returns User observable value from local storage.
   */
  public get userValue(): User | null {
    return this.userSubject.value;
  }

  /**
   * Login method for authentication via username and password. It saves user details and jwt token in local storage
   * to keep user logged in beetwen page refreshes.
   * @param username Username for login credentials
   * @param password Password for login credentials
   * Crypt @param password if file of configuration.crypto is true, encrypt password with aes method
   * @returns User details retrieved from back-end login endpoint
   */
  async login(username: string, password: string) {
    const users = await ipcRenderer.invoke("read",{path:"./users.json"})
    const jsonString = Buffer.from(users).toString('utf8')
    let result = JSON.parse(jsonString)
    //var encryptedPassword = this.processPassword(password,appConfiguration.passwordEncryption.enable);
    let u = result.users.filter((user: { username: string; password: string; }) => {
      return user.username == username && this.decryptPassword(user.password) == password
    })

    if (u.length > 0) {
      u = u[0]
      u.token = `fake-jwt-token.${u.username}`
      localStorage.setItem('user', JSON.stringify(u));
      this.userSubject.next(u);
      return u
    } else {
      return {"error": "Credenziali Errate!"}
    }
  }

  /**
   * It removes user data from local storage and redirect the user to login page to logout.
   */
  logout() {
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.redirectToLoginPage();
  }

  /**
   * Based on {@link appConfig}, it decide to encrypt or not password
   * @param password Password entered by the user
   * @returns Encrypted or original password
   */
  processPassword(password: string, isEncrypted: boolean): string {
    if (isEncrypted) {
      return CryptoJS.AES.encrypt(
        password,
        appConfiguration.passwordEncryption.key
      ).toString();
    } else {
      return password;
    }
  }
  decryptPassword(password: string): string {
    if (appConfiguration.passwordEncryption.enable) {
      var CryptoJS = require('crypto-js');
      return CryptoJS.AES.decrypt(
        password,
        appConfiguration.passwordEncryption.key
      ).toString(CryptoJS.enc.Utf8);;
    } else {
      return password;
    }
  }

  /**
   * Redirect to login page path
   */
  redirectToLoginPage() {
    this.router.navigate([Path.Login]);
  }
}
