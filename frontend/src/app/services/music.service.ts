import { Injectable } from '@angular/core';
import { smaple_music } from 'src/data';
import { Music } from '../shared/models/music';

@Injectable({
  providedIn: 'root'
})
export class MusicService {

  constructor() { }

  getAll():Music[]{
    return smaple_music;
  }

  getAllByArtistName(search:string){
    return this.getAll().filter(music=>music.artist_name.toLowerCase().includes(search.toLowerCase()));
  }

  getArtistByName(ArtName:string):Music{
    return this.getAll().find(music => music.artist_name === ArtName) ?? new Music();
  }
}
