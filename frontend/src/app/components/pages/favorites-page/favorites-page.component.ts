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

  updateList(playlist_name:string, public_selection:string, description:string){
    let url = "http://localhost:3000/playlist/updateplaylist";
    let token = localStorage.getItem('Token');
    let data = {
      "name":playlist_name,
      "description":description,
      "public":JSON.parse(public_selection)
    }
    let request = new Request(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer '+token
      },
      body: JSON.stringify(data)
    });
    fetch(request)
    .then(response => {
      if (response.ok){
        alert('Playlist update success!');
        window.location.reload();
      }
    })
    .catch(err =>{
      alert(err);
    })
  };
  // removeFromFavorites(favoritelist:FavoriteList){
  //   this.favoritesService.removeFromFavorites(favoritelist.music.name);
  // }

  // // addEmptyList(){
  // //   this.favoritesService.addEmptyList();
  // // }

  addNewList(new_listname:string, new_description:string){
    //let name = document.getElementById(: "listName").value;
  //  const inputName: HTMLElement = document.getElementById('listName') as HTMLElement;
    //const inputDecription: HTMLElement = document.getElementById('Decription') as HTMLElement;
    this.favoritesService.addNewList(new_listname, new_description);
  }

  deleteList(listname:string){
    if (window.confirm("Please confirm if you want to delte playlist "+listname)){
      this.favoritesService.deleteList(listname);
    };
  }
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
