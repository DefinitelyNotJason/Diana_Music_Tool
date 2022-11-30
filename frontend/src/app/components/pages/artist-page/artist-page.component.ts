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
  tracks!: string[];
  music!: Music[];
  length!:Number[];
  rating:number = 0;
  constructor(activatedRoute:ActivatedRoute, musicService:MusicService,
    private favoritesService:FavoritesService, private router: Router){
      this.music = [];
      this.length = Array(favoritesService.getFavoritesLen()).fill(1).map((x,i)=>i+1);
    activatedRoute.params.subscribe(async (params)=>{
      if(params['artist']) {
        await musicService.getArtistByName(params['artist'])
        .then(async response => {
          this.playlist = response;
          this.tracks = this.playlist.tracks;
        });
        if (this.tracks.length > 0){
          this.tracks.forEach(async trackid => {
            await musicService.getPlaylistByTracksId(trackid)
            .then(response =>{
              //在这加上youtube链接
              response.track_url = 'https://www.youtube.com/watch?v=fjFV4PQqS_I&list=RDEMY16mrgAz0nmiD2DAKY-YSg&start_radio=1';
              console.log(response);
              this.music.push(response);
            })
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

  onSubmit(stars: Number, review: string){
    console.log(stars,review);
  }
}
