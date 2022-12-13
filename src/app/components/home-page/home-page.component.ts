import {Component, OnInit, ViewChild} from '@angular/core';
import { User } from 'src/app/models/user';
import {IpcRenderer} from 'electron';
import { Shell} from 'electron';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {OrderModalComponent} from "./modals/order-modal/order-modal.component";
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
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  loading = false
  user:User | undefined
  dataJson: any[] = []
  displayedColumns: string[] = ['name', 'code','check', 'prog', 'retry', 'end','username','action'];
  dataSource!: MatTableDataSource<any>;
  private paginator!: MatPaginator;
  private sort!: MatSort;

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
  }

  constructor(public dialog: MatDialog,) {
    this.user = JSON.parse(localStorage.getItem("user")!)

  }

  async ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort;
    this.dataLoading()

  }
  async dataLoading(): Promise<void>{
    //this.users = this.valueUsers
    const books = await ipcRenderer.invoke("read", {path: "./data.json"})
    const jsonString = Buffer.from(books).toString('utf8')
    let result = JSON.parse(jsonString)
    this.dataJson = result.data
    this.dataSource = new MatTableDataSource(this.dataJson);
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort;
    if (this.paginator && this.sort) {
      this.dataSource!.filter = ""
    }
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource!.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  openDialog(type:string,element:any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.id = 'modal-component';
    dialogConfig.width = '300px';
    dialogConfig.data = {
      type: type,
      book: element
    }
    const dialogRef = this.dialog.open(OrderModalComponent,
      dialogConfig
    );
    dialogRef.afterClosed().subscribe(() => {
      this.dataLoading();
    });
  }

}


