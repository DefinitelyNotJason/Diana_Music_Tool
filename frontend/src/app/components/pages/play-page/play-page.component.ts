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
[x: string]: any;
  music!: Music[];
  length!:Number[];
  favName:string[] = [];
  isLogin = false;

  constructor(activatedRoute:ActivatedRoute, musicService:MusicService
    ,private favoritesService : FavoritesService){
    this.length = Array(favoritesService.getFavoritesLen()).fill(1).map((x,i)=>i+1);
    activatedRoute.params.subscribe((params)=>{
      if(params['search']) {
        musicService.searchByMusicName(params['search'])
        .then(async response =>{
          const login = localStorage.getItem('Token');
          if(login){
            this.isLogin = true;
          };
          const a: Music[] =[];
          await response.forEach(async (element: 
            { track_date_created : string;
              track_duration: string; 
              album_title: string ;
              artist_name: string; 
              _id: string; 
              track_title: string;
              track_date_recorded:string }) => {
            const singlemusic:Music = {
              track_id: element._id,
              track_date_recorded: element.track_date_recorded,
              track_date_created: element.track_date_created,
              track_duration: element.track_duration,
              album_title: element.album_title,
              track_title: element.track_title,
              track_url: "",
              artist_name: element.artist_name,
              track_banner: ""
            };
            a.push(singlemusic);
          });
          this.music = a;
        });

        // fetch get the favorlist
        const token = localStorage.getItem('Token');
        if (token){
          let url = "http://localhost:3000/playlist/getallplaylists/";
          let request = new Request(url, {
            method: 'GET',
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
              'Authorization': 'Bearer '+ token
            }
          });
          fetch(request)
          .then((response) => {
            response.json()
            .then(data => {
              data.forEach((element: { name: string}) => {
                this.favName.push(element.name);
              });
            })
            .catch(e=>{
              alert(e);
            });
          })
          .catch((e) => {
            throw e;
          });
        };
      };
    });
  };

  youtubePlay(track_title:string, artist_name:string){
    let youtube_url = `https://www.googleapis.com/youtube/v3/search?key=AIzaSyAb8LRIi4ekaTBTRHNIX5hi3oRUu--VKWw&type=video&part=snippet&maxResults=1&q=${track_title.replace(/\s/g, "")}%${artist_name.replace(/\s/g, "")}`;
    let req = new Request(youtube_url, {
      method: 'GET',
    });
    fetch(req)
    .then(res => {
      res.json()
      .then(data=>{
        window.open("https://www.youtube.com/embed/"+data.items[0].id.videoId, '_blank');
      });
    });
  };

  addToFav(track_id:string, favName:string):void{
    //console.log(music.track_id);
    const token = localStorage.getItem('Token');
    let urlget = "http://localhost:3000/playlist/searchlist/"+favName;
    let requestget = new Request(urlget, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    });

    fetch(requestget)
      .then((response) => {
        response.json()
        .then(data => {
        let list = data.tracks;

        list.push(track_id);
        console.log(list);
        let url = "http://localhost:3000/playlist/updatelist";
        let addlist = {
          'name': favName,
          'list': list
        }
        let request = new Request(url, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization': 'Bearer '+ token
          },
          body: JSON.stringify(addlist)
        });
        fetch(request)
        .then((response) => {
        response.json()
        .then(data => {
            alert("Add track to playlist success!");
          })
        .catch(e=>{
            alert(e);
          })
        })
        .catch((e) => {
          throw e;
        });
      })
      .catch(e=>{
        alert(e);
      })
    })
    .catch((e) => {
      throw e;
    });
  };
};
