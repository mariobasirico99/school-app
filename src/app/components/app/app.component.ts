import { Component, OnInit } from '@angular/core';

var imagesJson = require("src/assets/config/imageConfig.json")

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  sourceFolder = "../"
  images = imagesJson;

  constructor() { }

  ngOnInit(): void {
  }

}
