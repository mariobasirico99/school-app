import { Component, OnInit, ViewChild } from '@angular/core';
import { Role } from 'src/app/enum/role';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {AddUserModalComponent} from "./modals/add-user-modal/add-user-modal.component";
import {AddBookModalComponent} from "./modals/add-book-modal/add-book-modal.component";


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

  addBook(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.id = 'modal-component';
    dialogConfig.width = '400px';
    dialogConfig.data = {

    }
    const dialogRef = this.dialog.open(AddBookModalComponent,
      dialogConfig
    );
    dialogRef.afterClosed().subscribe(() => {
    });

  }

  addUser(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.id = 'modal-component';
    dialogConfig.width = '400px';
    dialogConfig.data = {

    }
    const dialogRef = this.dialog.open(AddUserModalComponent,
      dialogConfig
    );
    dialogRef.afterClosed().subscribe(() => {
    });

  }
}
