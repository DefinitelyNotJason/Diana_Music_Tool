import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MusicService } from 'src/app/services/music.service';
import { Music } from 'src/app/shared/models/music';

@Component({
  selector: 'app-artist-page',
  templateUrl: './artist-page.component.html',
  styleUrls: ['./artist-page.component.css']
})
export class ArtistPageComponent {
  artist!: Music;
  constructor(activatedRoute:ActivatedRoute, musicService:MusicService){
    activatedRoute.params.subscribe((params)=>{
      if(params['artist']) {
        this.artist = musicService.getArtistByName(params['artist']);
      }
    })
  }
}
