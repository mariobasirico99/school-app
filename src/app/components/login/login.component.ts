import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AnyRecord } from 'dns';
import { first } from 'rxjs';
import { Path } from 'src/app/enum/path';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
var appConfiguration = require('src/assets/config/appConfig.json');
var imagesJson = require("src/assets/config/imageConfig.json")
var colorsJson = require("src/assets/config/colorConfig.json")
import {Md5} from 'ts-md5/dist/md5';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: any;
  loading = false;
  submitted = false;
  error = '';
  isPasswordHidden = true;

  sourceFolder = "../"
  image = imagesJson;
  colorsConf = colorsJson.login;
  loginConfiguration = appConfiguration.login;
  
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
  ) {
    this.createForm();
    // redirect to home if already logged in
    if (this.authenticationService.userValue) {
      this.router.navigate([Path.Home]);
    }
    
  }
  onChange() {
    this.isPasswordHidden = !this.isPasswordHidden;
  }
  ngOnInit(): void {
    
  }

  createForm(){
    if(this.loginConfiguration.value == "username"){
      this.loginForm = this.formBuilder.group({
        username: ['', Validators.required],
        password: ['', Validators.required],
      });
    }
    else if(this.loginConfiguration.value == "email"){
      this.loginForm = this.formBuilder.group({
        email: ['', Validators.required],
        password: ['', Validators.required],
      });
    }
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService
      .login(this.f['username'].value, this.f['password'].value)
      .pipe(first())
      .subscribe({
        next: () => {
          // get return url from query parameters or default to home page
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.router.navigateByUrl(returnUrl);
        },
        error: (error) => {
          this.error = error;
          this.loading = false;
        },
      });
  }
}
