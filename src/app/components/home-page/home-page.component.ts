import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
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
var imagesJson = require("src/assets/config/imageConfig.json")
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  loading = false
  user:User | undefined

  constructor() { 
    this.user = JSON.parse(localStorage.getItem("user")!)
  }

  ngOnInit(): void {
    
  }
  
}


