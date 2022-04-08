import { Component, OnInit, ViewChild } from '@angular/core';
import { Role } from 'src/app/enum/role';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.css']
})
export class SettingsPageComponent implements OnInit {
  user:any;
  loading = false
  constructor(private authenticationService: AuthenticationService,
    public dialog: MatDialog
    ) {
      this.user = JSON.parse(localStorage.getItem("user")!) 
      
  }

   ngOnInit() {
  }

  get isAdmin() {
    return this.user && this.user.role === Role.Admin;
  }
}
