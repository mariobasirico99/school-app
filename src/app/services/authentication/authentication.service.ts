import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { User } from 'src/app/models/user';
import { environment } from 'src/environments/environment';
import { Path } from 'src/app/enum/path';
var appConfiguration = require('src/assets/config/appConfig.json');
/*
Per usare le implementazioni di electron 

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

const { ipcRenderer } = window.require('electron');
const { shell } = window.require('electron');
*/

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
  constructor(private router: Router, private http: HttpClient) {
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
  login(username: string, password: string){
    var encryptedPassword = this.processPassword(password,appConfiguration.passwordEncryption.enable);
    /* Se si vuole utilizzare il DB usare questa login --> metter il metodo login come async login():Promise<any>

    var result = await ipcRenderer.invoke("loginn",{username:username,password:password})
      if(result.length >0){
        result = result[0]
        if(result.password == encryptedPassword){
          result.token = `fake-jwt-token.${result.id}`,
          localStorage.setItem('user', JSON.stringify(result));
          this.userSubject.next(result);
          return result
        }
        else{
          return "Credenziali Errate!"
        }
      }
      else{
        return "Utente non trovato";
      }
    */
    return this.http
      .post<User>(`${environment.apiUrl}/users/authenticate`, {
        username,
        encryptedPassword,
      })
      .pipe(
        map((user) => {
          localStorage.setItem('user', JSON.stringify(user));
          this.userSubject.next(user);
          return user;
        })
      );
    
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
      var CryptoJS = require('crypto-js');
      return CryptoJS.AES.encrypt(
        password,
        appConfiguration.passwordEncryption.key
      ).toString();
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
