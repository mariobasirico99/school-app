import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
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
  selector: 'app-add-book-modal',
  templateUrl: './add-book-modal.component.html',
  styleUrls: ['./add-book-modal.component.css']
})
export class AddBookModalComponent implements OnInit {
  insertBook :any
  error = ""
  checked = false;
  constructor(private dialogRef: MatDialog,
              private formBuilder: FormBuilder,) {
    this.insertBook = this.formBuilder.group({
      name: ["", Validators.required],
      code: ["", Validators.required],
      check: [""],
      prog: [""]
    });
  }

  ngOnInit(): void {
  }
  changeCheck(){
    this.checked = !this.checked
  }
  async submitForm(){
    this.insertBook.controls.check.setValue(this.checked);
    let result = await ipcRenderer.invoke("writeFile", {type:"book", data:this.insertBook.value})
    if(result){
      this.dialogRef.closeAll();
    }
    else {
      this.error = "Libro non inserito correttamente!"
    }
  }
}
