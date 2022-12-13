import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {FormBuilder, Validators} from "@angular/forms";
var appConfiguration = require('../../../../../assets/config/appConfig.json');
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

@Component({
  selector: 'app-add-user-modal',
  templateUrl: './add-user-modal.component.html',
  styleUrls: ['./add-user-modal.component.css']
})
export class AddUserModalComponent implements OnInit {
  user:any
  insertUser:any
  isPasswordHidden=true;
  error = ""
  constructor(
    private dialogRef: MatDialog,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    public data: AddUserModalComponent,
    ) {
    this.user = JSON.parse(localStorage.getItem("user")!)
    this.insertUser = this.formBuilder.group({
      username: ["", Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }
  async submitForm(){
    let temp = this.insertUser.value.password
    this.insertUser.controls["password"].setValue(this.processPassword(temp,true))
    console.log("insertUser",this.insertUser.value)
    let result = await ipcRenderer.invoke("writeFile", {type:"user", data:this.insertUser.value})
      if(result){
        this.dialogRef.closeAll();
      }
      else {
        this.error = "Utente non inserito correttamente!"
        this.insertUser.controls["password"].setValue(temp)
      }
  }

  onChange() {
    this.isPasswordHidden = !this.isPasswordHidden;
  }
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
}
