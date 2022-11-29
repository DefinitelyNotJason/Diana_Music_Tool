import { Injectable } from '@angular/core';
import { find } from 'rxjs';
import { sample_music, smaple_playlist } from 'src/data';
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
    return await this.getAll()
      .then(response => {
        return response.find(music => music._id === ArtName) ?? new PlayList();
      });
  }

  getPlaylistByTracksId(trackid:number):Music{
    return this.getMusic().find(music => music.tracks === trackid) ?? new Music();
  }
}
