import { Component } from '@angular/core';
import { FavoritesService } from 'src/app/services/favorites.service';
import { FavoriteList } from 'src/app/shared/models/favoritelist';
import { Favorites } from 'src/app/shared/models/favorites';

@Component({
  selector: 'app-favorites-page',
  templateUrl: './favorites-page.component.html',
  styleUrls: ['./favorites-page.component.css']
})
export class FavoritesPageComponent {
  favorites! :Favorites;
  constructor(private favoritesService : FavoritesService){
    this.favoritesService.getFavoritesObservable()
    .subscribe((favorites)=> (this.favorites = favorites));
  } 

  removeFromFavorites(favoritelist:FavoriteList){
    this.favoritesService.removeFromFavorites(favoritelist.music.name);
  }

  addEmptyList(){
    this.favoritesService.addEmptyList();
  }

}
