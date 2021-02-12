import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './_helpers/auth.guard';
import { AboutComponent } from "./about/about.component";


const authLayoutModule = () => import('./auth-layout/auth-layout.module').then(x => x.AuthLayoutModule);
const userProfileModule = () => import('./user-profile/user-profile.module').then(x => x.UserProfileModule);

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'user-profile', loadChildren: userProfileModule, canActivate: [AuthGuard] },
  { path: 'auth', loadChildren: authLayoutModule },
  { path: 'about', component: AboutComponent },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
