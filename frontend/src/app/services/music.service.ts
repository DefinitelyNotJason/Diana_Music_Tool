import { Injectable } from '@angular/core';
import { sample_music, smaple_playlist } from 'src/data';
import { Music } from '../shared/models/music';
import { PlayList } from '../shared/models/playlist';

@Injectable({
  providedIn: 'root'
})
export class MusicService {

  constructor() { }

  getAll():PlayList[]{
    return smaple_playlist;
  }

  getMusic():Music[]{
    return sample_music;
  }

  searchByMusicName(search:string){
    return this.getMusic().filter(music=>music.name.toLowerCase().includes(search.toLowerCase()));
  }

  getArtistByName(ArtName:string):PlayList{
    return this.getAll().find(music => music._id === ArtName) ?? new PlayList();
  }
}
