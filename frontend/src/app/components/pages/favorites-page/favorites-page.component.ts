import { Component } from '@angular/core';
import { FavoritesService } from 'src/app/services/favorites.service';
import { Music } from 'src/app/shared/models/music';
import { PlayList } from 'src/app/shared/models/playlist';

@Component({
  selector: 'app-favorites-page',
  templateUrl: './favorites-page.component.html',
  styleUrls: ['./favorites-page.component.css']
})
export class FavoritesPageComponent {
  playlists:PlayList[] = [];
  all_tracks:Music[][] = [];
  constructor(private favoritesService : FavoritesService){
    this.favoritesService.getAllPlaylist()
    .then(async response =>{
      let temp:Music[][] = [];
      for (const list of response){
        let tracks = await Promise.all(list.tracks.map(this.getListTracks));
        temp.push(tracks);
      };
      this.all_tracks = temp.slice(0);
      this.playlists = response;
    })
  };

  async getListTracks(id:string):Promise<Music>{
    let temp_music:Music = {
      track_id:"",
      track_title:"",
      track_url:"",
      track_banner: "",
      artist_name:""
    }
    let url = localStorage.getItem('localpwd') + "/track/getbyid/"+id;
    let request = new Request(url, {
      method: 'GET'
    });
    return await fetch(request)
    .then(async(response) => {
      return await response.json()
      .then((data) =>{
        let new_music:Music = {
          track_id:id,
          track_title:data.track_title,
          track_url:"",
          track_banner: "",
          artist_name:data.artist_name
        }
        return new_music;
      })
      .catch(err => {
        alert(err);
        return temp_music;
      });
    })
    .catch(err=>{
      alert(err);
      throw err;
    })
  };

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
  };
};
