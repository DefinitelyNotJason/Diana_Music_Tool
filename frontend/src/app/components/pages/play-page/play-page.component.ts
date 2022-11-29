import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FavoritesService } from 'src/app/services/favorites.service';
import { MusicService } from 'src/app/services/music.service';
import { Music } from 'src/app/shared/models/music';

@Component({
  selector: 'app-play-page',
  templateUrl: './play-page.component.html',
  styleUrls: ['./play-page.component.css']
})
export class PlayPageComponent {
  music!: Music[];
  length!:Number[];

  constructor(activatedRoute:ActivatedRoute, musicService:MusicService
    ,private favoritesService : FavoritesService){
      this.length = Array(favoritesService.getFavoritesLen()).fill(1).map((x,i)=>i+1);
    activatedRoute.params.subscribe((params)=>{
      if(params['search']) {
       let musicjson = musicService.searchByMusicName(params['search']);
       console.log(musicjson);
      }
    })
  }



  addToFavorites(music:Music,list:string):void{
    this.favoritesService.addMusicToList(music,Number(list));
  }
}
