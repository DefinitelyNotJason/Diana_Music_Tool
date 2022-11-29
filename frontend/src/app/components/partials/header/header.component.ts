import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FavoritesService } from 'src/app/services/favorites.service';
import { LoginPageComponent } from '../../pages/login-page/login-page.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  favoritesQuantity = 0;
  userNanme;
  isLogin = false;
  isAdmin = true;
  constructor(activatedRoute :ActivatedRoute ,favoritesService:FavoritesService){
    favoritesService.getFavoritesObservable().subscribe((newFavorites) => {
      this.favoritesQuantity = newFavorites.totalCount;
    });
    if(localStorage.getItem('Token')){
      this.userNanme = localStorage.getItem('Token');
      this.isLogin = true;
    }
  }
}
