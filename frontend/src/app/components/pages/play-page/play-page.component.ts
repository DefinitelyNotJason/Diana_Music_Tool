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
       .then(async response =>{
          //console.log(response);
          //console.log(response[0].track_id, response[0].track_title, response[0].license_url);
          const a: Music[] =[];
          await response.forEach(async (element: { artist_name: string; track_id: string; track_title: string; }) => {
            // //add youtube link
            // let youtube_url = `https://www.googleapis.com/youtube/v3/search?key=AIzaSyAb8LRIi4ekaTBTRHNIX5hi3oRUu--VKWw&type=video&part=snippet&maxResults=1&q=${element.track_title.replace(/\s/g, "")}%${element.artist_name.replace(/\s/g, "")}`;
            // let req = new Request(youtube_url, {
            //   method: 'GET',
            // });
            // await fetch(req)
            // .then(async res => {
            //   await res.json()
            //   .then(data=>{
            //     const singlemusic:Music = {
            //       track_id: element.track_id,
            //       track_title: element.track_title,
            //       track_url: "https://www.youtube.com/embed/"+data.items[0].id.videoId,
            //       artist_name: element.artist_name,
            //       track_banner: data.items[0].snippet.thumbnails.high.url
            //     };
            //     a.push(singlemusic);
            //   });
            // });
            const singlemusic:Music = {
              track_id: element.track_id,
              track_title: element.track_title,
              track_url: "",
              artist_name: element.artist_name,
              track_banner: ""
            };
            a.push(singlemusic);
          });
          this.music = a;
       });
      }
    })
  }



  addToFavorites(music:Music,list:string):void{
    this.favoritesService.addMusicToList(music,Number(list));
  }
}
