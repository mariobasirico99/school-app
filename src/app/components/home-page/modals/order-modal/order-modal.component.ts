import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {FormBuilder, Validators} from "@angular/forms";
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
  selector: 'app-order-modal',
  templateUrl: './order-modal.component.html',
  styleUrls: ['./order-modal.component.css']
})
export class OrderModalComponent implements OnInit {
  insertBook :any
  error = ""
  book:any
  type: any;
  checked: boolean = false;
  constructor(private dialogRef: MatDialog,
              @Inject(MAT_DIALOG_DATA)
              public data: OrderModalComponent,

              private formBuilder: FormBuilder,) {

  }
  ngOnInit(): void {
    this.book = this.data.book
    this.type = this.data.type
    this.checked = this.book.check? true:false
    this.initForm()

  }
  initForm(){
    this.insertBook = this.formBuilder.group({
      name: [this.book.name, Validators.required],
      code: [this.book.code, Validators.required],
      retry: [this.book.retry ? this.book.retry : ""],
      end: [this.book.end  ? this.book.end : ""],
      username: [this.book.username  ? this.book.username : ""],
      check: [this.book.check],
      prog: [this.book.check ? this.book.prog : ""]
    });

  }
  changeCheck(){
    this.checked = !this.checked
  }
  async submitForm(){
    this.insertBook.controls.check.setValue(this.checked);
    let result = await ipcRenderer.invoke("editFile", {type:"book", data:this.insertBook.value})
    if(result){
      this.dialogRef.closeAll();
    }
    else {
      this.error = "Libro non modificato!"
    }
  }
  async deleteSelected(){
    let result = await ipcRenderer.invoke("deleteFile", {type:"book", data:this.book})
    if(result){
      this.dialogRef.closeAll();
    }
    else {
      this.error = "Libro non eliminato!"
    }
  }

}
