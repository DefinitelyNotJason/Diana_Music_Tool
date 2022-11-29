import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FavoritesService } from 'src/app/services/favorites.service';
import { MusicService } from 'src/app/services/music.service';
import { Music } from 'src/app/shared/models/music';
import { PlayList } from 'src/app/shared/models/playlist';

@Component({
  selector: 'app-artist-page',
  templateUrl: './artist-page.component.html',
  styleUrls: ['./artist-page.component.css']
})
export class ArtistPageComponent {
  playlist!: PlayList;
  tracks!: number[];
  music!: Music[];
  length!:Number[];
  constructor(activatedRoute:ActivatedRoute, musicService:MusicService,
    private favoritesService:FavoritesService, private router: Router){
      this.music = [];
      this.length = Array(favoritesService.getFavoritesLen()).fill(1).map((x,i)=>i+1);
    activatedRoute.params.subscribe(async (params)=>{
      if(params['artist']) {
        await musicService.getArtistByName(params['artist'])
        .then(response => {
          this.playlist = response;
          this.tracks = this.playlist.tracks;
        });
        if (this.tracks.length > 0){
          this.tracks.forEach(trackid => {
            this.music.push(musicService.getPlaylistByTracksId(trackid));   
          });
        }
      }
    })
  }
  addMusicToList(music: Music, index:string){
    this.favoritesService.addMusicToList(music,Number(index));
  }
  addToFavorites(){
    this.favoritesService.addToFavorites(this.playlist);
    this.router.navigateByUrl('/favorites-page');
  }

}
