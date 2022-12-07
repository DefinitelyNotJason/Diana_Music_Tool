import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPageComponent } from './components/pages/admin-page/admin-page.component';
import { ArtistPageComponent } from './components/pages/artist-page/artist-page.component';
import { FavoritesPageComponent } from './components/pages/favorites-page/favorites-page.component';
import { HomeComponent } from './components/pages/home/home.component';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { PlayPageComponent } from './components/pages/play-page/play-page.component';
import { RegisterPageComponent } from './components/pages/register-page/register-page.component';
import { GoogleTokenComponentComponent } from './components/pages/google-token.component/google-token.component.component';
import { PasswordComponent } from './components/pages/password/password.component';
import { PolicyPageComponent } from './components/pages/policy-page/policy-page.component';
import { AdminPolicyComponent } from './components/pages/admin-policy/admin-policy.component';

const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:'google/:token', component:GoogleTokenComponentComponent},
  {path:'search/:search',component:PlayPageComponent},
  {path:'artist/:artist',component:ArtistPageComponent},
  {path:'favorites-page',component:FavoritesPageComponent},
  {path:'login',component:LoginPageComponent},
  {path:'password',component:PasswordComponent},
  {path:'admin',component:AdminPageComponent},
  {path:'register',component:RegisterPageComponent},
  {path:'policy',component:PolicyPageComponent},
  {path:'admin_policy',component:AdminPolicyComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {};
