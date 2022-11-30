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
       musicService.searchByMusicName(params['search'])
       .then(response =>{
          //console.log(response);
          //console.log(response[0].track_id, response[0].track_title, response[0].license_url);
          const a: Music[] =[];
          response.forEach((element: { track_id: string; track_title: string; license_url: string; }) => {

            const singlemusic:Music = {
              track_id: element.track_id,
              track_title: element.track_title,
              track_url: element.license_url
            };
            a.push(singlemusic);
          });
          console.log(a);
          this.music = a;
       });

      }
    })
  }



  addToFavorites(music:Music,list:string):void{
    this.favoritesService.addMusicToList(music,Number(list));
  }
}
