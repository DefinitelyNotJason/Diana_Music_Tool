import { Component } from '@angular/core';
import { FavoritesService } from 'src/app/services/favorites.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  favoritesQuantity = 0;
  userNanme = "abc";
  isAdmin = true;
  constructor(favoritesService:FavoritesService){
    favoritesService.getFavoritesObservable().subscribe((newFavorites) => {
      this.favoritesQuantity = newFavorites.totalCount;
    })
  }
}
