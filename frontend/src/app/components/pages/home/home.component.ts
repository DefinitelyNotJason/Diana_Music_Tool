import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MusicService } from 'src/app/services/music.service';
import { PlayList } from 'src/app/shared/models/playlist';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  playlist:PlayList[] = [];

  constructor(private musicService:MusicService , activatedRoute:ActivatedRoute){
    activatedRoute.params.subscribe((params)=>{
      // if(params['search']){
      //   this.playlist = musicService.getAllByArtistName(params['search']);
      // }else{
        musicService.getAll()
        .then(response =>{
          this.playlist = response;

        })
      // }
    })
  }

}
