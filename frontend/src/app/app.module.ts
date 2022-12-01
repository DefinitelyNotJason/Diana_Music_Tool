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
import { TitleComponent } from './components/partials/title/title.component';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PlayPageComponent } from './components/pages/play-page/play-page.component';
import { AdminPageComponent } from './components/pages/admin-page/admin-page.component';
import { RegisterPageComponent } from './components/pages/register-page/register-page.component';
import { GoogleTokenComponentComponent } from './components/pages/google-token.component/google-token.component.component';
import { PasswordComponent } from './components/pages/password/password.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    SearchComponent,
    ArtistPageComponent,
    FavoritesPageComponent,
    TitleComponent,
    LoginPageComponent,
    PlayPageComponent,
    AdminPageComponent,
    RegisterPageComponent,
    GoogleTokenComponentComponent,
    PasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    RatingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
