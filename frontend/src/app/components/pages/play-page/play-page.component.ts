import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MusicService } from 'src/app/services/music.service';
import { Music } from 'src/app/shared/models/music';

@Component({
  selector: 'app-play-page',
  templateUrl: './play-page.component.html',
  styleUrls: ['./play-page.component.css']
})
export class PlayPageComponent {
  music!: Music[];
  constructor(activatedRoute:ActivatedRoute, musicService:MusicService){
    activatedRoute.params.subscribe((params)=>{
      if(params['search']) {
        this.music = musicService.searchByMusicName(params['search']);
      }
    })
  }
}
