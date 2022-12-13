import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AngularMaterialModule } from './modules/angular-material.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { PageSpinnerComponent } from './components/page-spinner/page-spinner.component';
import { DefaultPageComponent } from './components/default-page/default-page.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { SettingsPageComponent } from './components/settings-page/settings-page.component';
import { AddUserModalComponent } from './components/settings-page/modals/add-user-modal/add-user-modal.component';
import { AddBookModalComponent } from './components/settings-page/modals/add-book-modal/add-book-modal.component';
import { OrderModalComponent } from './components/home-page/modals/order-modal/order-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    SettingsComponent,
    PageSpinnerComponent,
    DefaultPageComponent,
    HomePageComponent,
    SettingsPageComponent,
    AddUserModalComponent,
    AddBookModalComponent,
    OrderModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularMaterialModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
