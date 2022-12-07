import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FavoriteList } from '../shared/models/favoritelist';
import { Favorites } from '../shared/models/favorites';
import { Music } from '../shared/models/music';
import { PlayList } from '../shared/models/playlist';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private favorites:Favorites = this.getFavoritesToLocalStorage();
  private favoritesSubject: BehaviorSubject<Favorites> = new BehaviorSubject(this.favorites);

  constructor() { }

  getFavoritesLen():number{
    return this.favorites.artists.length;
  }

  addNewList(new_listname:string, new_description:string){
    if (new_description == ""){
      new_description = " ";
    }
    let url = localStorage.getItem('localpwd') + "/playlist/savelist";
    let token = localStorage.getItem('Token');
    let data = {
      "name":new_listname,
      "description":new_description
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
      response.json()
      .then(data=>{
        if (data.success){
          alert('Playlist create success!');
          window.location.reload();
        } else {
          alert(data.error);
        }
      })
    })
    .catch(err =>{
      alert(err);
    })
  };

  deleteList(listname:string) {
    let url = localStorage.getItem('localpwd') + "/playlist/deletelist";
    let token = localStorage.getItem('Token');
    let data = {
      "name":listname,
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
      response.json()
      .then(data=>{
        if (data.success){
          alert('Playlist delete success!');
          window.location.reload();
        } else {
          alert(data.error);
        }
      })
    })
    .catch(err =>{
      alert(err);
    })
  };

  updateList(playlist_name:string, public_selection:string, description:string){
    if (description == ""){
      description = " ";
    }
    let url = localStorage.getItem('localpwd') + "/playlist/updateplaylist";
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
      response.json()
      .then(data=>{
        if(data.success){
          alert('Playlist update success!');
          window.location.reload();
        } else {
          alert(data.error);
        }
      })
      .catch(err=>{
        alert(err);
      })
    })
    .catch(err =>{
      alert(err);
    });
  };

  deleteTrack(listname:string, tracks:string[], track_select:string){
    tracks = tracks.filter(e => e !== track_select);
    let url = localStorage.getItem('localpwd') + "/playlist/updatelist";
    let token = localStorage.getItem('Token');
    let data = {
      "name":listname,
      "list":tracks
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
      response.json()
      .then(data=>{
        if(data.success){
          alert('Track delete success!');
          window.location.reload();
        } else {
          alert(data.error);
        }
      })
      .catch(err=>{
        alert(err);
      })
    })
    .catch(err =>{
      alert(err);
    });
  };

  addMusicToList(music:Music,list:number):void{
    // if(!this.favorites.artists[list-1].music.tracks.find(index => index === music.tracks))
    // this.favorites.artists[list-1].music.tracks.push(music.tracks);
    // this.setFavoritesToLocalStorage();
  }

  addToFavorites(music:PlayList):void{
    let favoritelist = this.favorites.artists.find(i => i.music.name === music.name);
    if(favoritelist)
      return;

    this.favorites.artists.push(new FavoriteList(music));
    this.setFavoritesToLocalStorage();
  }

  removeFromFavorites(name:string):void{
    this.favorites.artists = this.favorites.artists.filter(i => i.music.name != name);
    this.setFavoritesToLocalStorage();
  }

  editDescription(music:PlayList, edit: string):void{
    let inputDescription = edit;
    let favoritelist = this.favorites.artists.find(i => i.music.name === music.name);
    if(favoritelist){
    favoritelist.music.description = inputDescription;
    this.setFavoritesToLocalStorage();
    }
  }

  publicOrNot(music:PlayList, TorF: string):void{
    let result = TorF;
    const token = localStorage.getItem('Token');

    let favoritelist = this.favorites.artists.find(i => i.music.name === music.name);
    if(favoritelist){
    let url = localStorage.getItem('localpwd') + "/playlist/updateplaylist";
    const user = {
      name:favoritelist.music.name,
      description:favoritelist.music.description,
      public: result
    };
    let request = new Request(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer '+ token
      },
      body: JSON.stringify(user)
    });

    fetch(request)
    .then((response) => {
      if (response.ok){
        response.json()
        .then(data => {
          alert('hidden success!');

        })
      } else {
        response.json()
        .then(data => {
          alert(data.error);
        })
      }
    })
    .catch((e) => {
      throw e;
    });


  }

  }

  async getAllPlaylist():Promise<PlayList[]>{
    let r_data:PlayList[] = [];
    let url = localStorage.getItem('localpwd') + "/playlist/getallplaylists";
    let token = localStorage.getItem('Token');
    let request = new Request(url, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer '+token
      }
    });
    const response = await fetch(request);
    if (response.ok) {
      return response.json()
        .then(data => {
          r_data = data;
          return r_data;
        });
    } else {
      return r_data;
    }
  }

  private setFavoritesToLocalStorage():void{
    this.favorites.totalCount = this.favorites.artists
    .reduce((prevSum,current) => prevSum+current.quantity ,0);

    const favoritesJson = JSON.stringify(this.favorites);
    localStorage.setItem('Favorites',favoritesJson);
    this.favoritesSubject.next(this.favorites);
  }

  private getFavoritesToLocalStorage():Favorites{
    const favoritesJson = localStorage.getItem('Favorites');
    return favoritesJson ? JSON.parse(favoritesJson):new Favorites();
  }
}
