import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MusicService } from 'src/app/services/music.service';
import { Music } from 'src/app/shared/models/music';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  music:Music[] = [];

  constructor(private musicService:MusicService , activatedRoute:ActivatedRoute){
    activatedRoute.params.subscribe((params)=>{
      if(params['search']){
        this.music = musicService.getAllByArtistName(params['search']);
      }else{
        this.music = musicService.getAll();
      }
    })
  }

}
