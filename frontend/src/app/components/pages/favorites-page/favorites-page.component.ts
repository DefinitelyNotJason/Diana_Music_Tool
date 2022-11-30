import { Component, ɵNG_ELEMENT_ID } from '@angular/core';
import { string } from 'joi';
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

  // addEmptyList(){
  //   this.favoritesService.addEmptyList();
  // }

  addNewList():void{
    //let name = document.getElementById(: "listName").value;
  //  const inputName: HTMLElement = document.getElementById('listName') as HTMLElement;
    //const inputDecription: HTMLElement = document.getElementById('Decription') as HTMLElement;
    this.favoritesService.addNewList();
  }
  editDescription(favoritelist:FavoriteList){
    this.favoritesService.editDescription(favoritelist.music);

}
}
