import { Injectable } from '@angular/core';
import { find } from 'rxjs';
import { sample_music } from 'src/data';
import { Music } from '../shared/models/music';
import { PlayList } from '../shared/models/playlist';

@Injectable({
  providedIn: 'root'
})
export class MusicService {

  constructor() { }

  async getAll():Promise<PlayList[]>{
    let r_data:PlayList[] = [];
    let url = "http://localhost:3000/playlist/getlist";
    let request = new Request(url, {
      method: 'GET',
    });
    return fetch(request)
    .then(response => {
      if (response.ok){
        return response.json()
        .then(data => {
          r_data = data;
          return r_data;
        })
      } else {
        return r_data;
      }
    })
  }

  getMusic():Music[]{
    return sample_music;
  }

 searchByMusicName(search:string){
  let url = "http://localhost:3000/track/search/"+ search;
  let request = new Request(url, {
    method: 'GET',
  });
  return fetch(request)
  .then(response => {
    if (response.ok){
        //alert('search success!');
        return  response.json()
      .then(data => {
          // alert(data);

          return data;
      })
    } else {
      return response.json()
      .then(data => {
        alert(data.error);
        return data.error;
      })
    }
  })
  .catch((e) => {
    throw e;
  });
    //return this.getMusic().filter(music=>music.name.toLowerCase().includes(search.toLowerCase()));
  }

  async getArtistByName(ArtName:string):Promise<PlayList>{
    let url = "http://localhost:3000/playlist/searchlist/"+ArtName;
    let request = new Request(url, {
      method: 'GET',
    });
    return await fetch(request)
    .then(async response => {
      if (response.ok){
          return response.json()
        .then(data => {
            return data;
        })
      } else {
        return response.json()
        .then(data => {
          alert(data.error);
          return data.error;
        })
      }
    })
    .catch((e) => {
      throw e;
    });
  }

  async getPlaylistByTracksId(trackid:string):Promise<Music>{
    let url = "http://localhost:3000/track/getbyid/"+trackid;
    let request = new Request(url, {
      method: 'GET',
    });
    return await fetch(request)
    .then(async response => {
      if (response.ok){
          return response.json()
        .then(data => {
          return data;
        })
      } else {
        return response.json()
        .then(data => {
          alert(data.error);
          return [];
        })
      }
    })
    .catch((e) => {
      throw e;
    });
  }
}
