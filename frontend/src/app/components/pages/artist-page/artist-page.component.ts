import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FavoritesService } from 'src/app/services/favorites.service';
import { MusicService } from 'src/app/services/music.service';
import { PlayList } from 'src/app/shared/models/playlist';

@Component({
  selector: 'app-artist-page',
  templateUrl: './artist-page.component.html',
  styleUrls: ['./artist-page.component.css']
})
export class ArtistPageComponent {
  artist!: PlayList;
  constructor(activatedRoute:ActivatedRoute, musicService:MusicService,
    private favoritesService:FavoritesService, private router: Router){
    activatedRoute.params.subscribe((params)=>{
      if(params['artist']) {
        this.artist = musicService.getArtistByName(params['artist']);
      }
    })
  }

  addToFavorites(){
    this.favoritesService.addToFavorites(this.artist);
    this.router.navigateByUrl('/favorites-page');
  }

}
