/* The part of this frontend project is citing from:
Youtube course: "The Ultimate Angular and Nodejs Tutorial For Beginners 2022"
Youtube link: https://www.youtube.com/watch?v=NFh9WEH0Zi4
Source code: https://github.com/nasirjd/foodmine-course
Author: nasirjd
Date: 2022
Code version: N/A

Citing parts include: Following the video, mocking the way the course builds an Angular frontend,
part of login page/register page CSS (form part), the structure of routing model */

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RatingModule} from 'ng-starrating';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/partials/header/header.component';
import { HomeComponent } from './components/pages/home/home.component';
import { SearchComponent } from './components/partials/search/search.component';
import { ArtistPageComponent } from './components/pages/artist-page/artist-page.component';
import { FavoritesPageComponent } from './components/pages/favorites-page/favorites-page.component';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PlayPageComponent } from './components/pages/play-page/play-page.component';
import { AdminPageComponent } from './components/pages/admin-page/admin-page.component';
import { RegisterPageComponent } from './components/pages/register-page/register-page.component';
import { GoogleTokenComponentComponent } from './components/pages/google-token.component/google-token.component.component';
import { PasswordComponent } from './components/pages/password/password.component';
import { PolicyPageComponent } from './components/pages/policy-page/policy-page.component';
import { AdminPolicyComponent } from './components/pages/admin-policy/admin-policy.component';

@NgModule({
  declarations: [AppComponent,HeaderComponent,HomeComponent,SearchComponent,ArtistPageComponent,
    FavoritesPageComponent,LoginPageComponent,PlayPageComponent,AdminPageComponent,
    RegisterPageComponent,GoogleTokenComponentComponent,PasswordComponent,PolicyPageComponent,
    AdminPolicyComponent],
  imports: [BrowserModule,AppRoutingModule,ReactiveFormsModule,RatingModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
