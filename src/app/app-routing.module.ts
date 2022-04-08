import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SettingsComponent } from './components/settings/settings.component';
import { Path } from './enum/path';
import { Role } from './enum/role';
import { AuthGuard } from './helpers/auth.guard';

const routes: Routes = [
  {
    path: Path.Home,
    component: HomeComponent,
   canActivate: [AuthGuard],
  },
  {
    path: Path.Settings,
    component: SettingsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: Path.Login,
    component: LoginComponent,
  },
  { path: '**', redirectTo: Path.Home },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
