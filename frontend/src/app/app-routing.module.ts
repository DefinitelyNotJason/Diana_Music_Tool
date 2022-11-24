import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPageComponent } from './components/pages/admin-page/admin-page.component';
import { ArtistPageComponent } from './components/pages/artist-page/artist-page.component';
import { FavoritesPageComponent } from './components/pages/favorites-page/favorites-page.component';
import { HomeComponent } from './components/pages/home/home.component';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { PlayPageComponent } from './components/pages/play-page/play-page.component';

const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:'search/:search',component:PlayPageComponent},
  {path:'artist/:artist',component:ArtistPageComponent},
  {path:'favorites-page',component:FavoritesPageComponent},
  {path:'login',component:LoginPageComponent},
  {path:'admin',component:AdminPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
