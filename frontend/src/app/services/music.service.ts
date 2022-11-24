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

  getPlaylistByTracksId(trackid:number):Music{
    return this.getMusic().find(music => music.tracks === trackid) ?? new Music();
  }
}
