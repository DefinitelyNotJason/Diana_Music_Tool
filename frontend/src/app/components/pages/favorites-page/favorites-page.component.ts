import { Component, ɵNG_ELEMENT_ID } from '@angular/core';
import { string } from 'joi';
import { FavoritesService } from 'src/app/services/favorites.service';
import { FavoriteList } from 'src/app/shared/models/favoritelist';
import { Favorites } from 'src/app/shared/models/favorites';
import { PlayList } from 'src/app/shared/models/playlist';

@Component({
  selector: 'app-favorites-page',
  templateUrl: './favorites-page.component.html',
  styleUrls: ['./favorites-page.component.css']
})
export class FavoritesPageComponent {
  playlists! :PlayList[];
  constructor(private favoritesService : FavoritesService){
    this.favoritesService.getAllPlaylist()
    .then(response =>{
      this.playlists = response;
    })
  }

  addNewList(new_listname:string, new_description:string){
    this.favoritesService.addNewList(new_listname, new_description);
  };

  updateList(playlist_name:string, public_selection:string, description:string){
    this.favoritesService.updateList(playlist_name, public_selection, description);
  };

  deleteList(listname:string){
    if (window.confirm("Please confirm if you want to delte playlist "+listname)){
      this.favoritesService.deleteList(listname);
    };
  };

  deleteTrack(listname:string, tracks:string[], track_select:string){
    this.favoritesService.deleteTrack(listname, tracks, track_select);
  }
  // removeFromFavorites(favoritelist:FavoriteList){
  //   this.favoritesService.removeFromFavorites(favoritelist.music.name);
  // }

  // // addEmptyList(){
  // //   this.favoritesService.addEmptyList();
  // // }

  // editDescription(playlist:PlayList, edit:string ){
  //   this.favoritesService.editDescription(favoritelist.music, edit);
  // }

  // publicOrNot(favoritelist:FavoriteList, TorF: string){
  //   this.favoritesService.publicOrNot(favoritelist.music, TorF);
  // }
  // deleteTrack(favoritelist:FavoriteList){
  //   this.favoritesService.deleteTrack(favoritelist.music);
  // }
}
