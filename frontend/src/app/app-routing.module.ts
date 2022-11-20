import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArtistPageComponent } from './components/pages/artist-page/artist-page.component';
import { HomeComponent } from './components/pages/home/home.component';

const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:'search/:search',component:HomeComponent},
  {path:'artist/:artist',component:ArtistPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
