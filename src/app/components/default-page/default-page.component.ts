import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Page } from 'src/app/enum/page';
import { Path } from 'src/app/enum/path';
import { Role } from 'src/app/enum/role';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
var imagesJson = require("src/assets/config/imageConfig.json")

@Component({
  selector: 'app-default-page',
  templateUrl: './default-page.component.html',
  styleUrls: ['./default-page.component.css']
})
export class DefaultPageComponent implements OnInit {
  pageType!: string;
  user:any;
  image = imagesJson;
  constructor(private router: Router,
    private authenticationService : AuthenticationService) { 
      this.user = JSON.parse(localStorage.getItem("user")!)
    }

  ngOnInit(): void {
    switch (this.router.url) {
      case `/${Path.Home}`:
        this.pageType = Page.Home;
        break;
      case `/${Path.Settings}`:
        this.pageType = Page.Settings;
        break;
      default:
        this.pageType = 'Sconosciuta';
    }
  }
  redirectToLogin() {
    this.authenticationService.logout()
  }
  onSettingsRedirect() {
    this.router.navigateByUrl(Path.Settings);
  }
  onHomeRedirect() {
    this.router.navigateByUrl(Path.Home);
  }
  get isAdmin() {
    return this.user && this.user.role === Role.Admin;
  }
}
