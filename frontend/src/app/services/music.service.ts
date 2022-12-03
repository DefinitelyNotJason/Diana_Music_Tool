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
          for (const elem of data){
            const tracks = elem.tracks;
            if (tracks.length < 1){
              elem.banner_url = '../img/default.jpg'
            } else {
              // const trackid = tracks[0];
              // let track_url = "http://localhost:3000/track/getbyid/"+trackid;
              // let req = new Request(track_url, {
              //   method: 'GET'
              // });
              // fetch(req)
              // .then(rsp => {
              //   rsp.json()
              //   .then((data) =>{
              //     console.log(data)
              //   })
              // })
            };
          };
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
          if (data.length ==0){
            alert("no result");
          }
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
