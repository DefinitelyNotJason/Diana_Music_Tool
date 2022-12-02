import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FavoritesService } from 'src/app/services/favorites.service';
import { MusicService } from 'src/app/services/music.service';
import { Music } from 'src/app/shared/models/music';
import { PlayList } from 'src/app/shared/models/playlist';

@Component({
  selector: 'app-play-page',
  templateUrl: './play-page.component.html',
  styleUrls: ['./play-page.component.css']
})
export class PlayPageComponent {
  music!: Music[];
  length!:Number[];
  favName:string[] = [];
  allfav: fav[]=[];


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
          await response.forEach(async (element: { artist_name: string; _id: string; track_title: string; }) => {
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
              track_id: element._id,
              track_title: element.track_title,
              track_url: "",
              artist_name: element.artist_name,
              track_banner: ""
            };
            a.push(singlemusic);
            //console.log(element);
          });
          this.music = a;
       });

      /// fetch get the favorlist
      const token = localStorage.getItem('Token');
      let url = "http://localhost:3000/playlist/getlist";
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
          //console.log(data);
          data.forEach((element: { name: string,  _id:string ,tracks: string}) => {
            this.favName.push(element.name);

            const singlelist:fav = {
              name : element.name,
              tracks: element.tracks
            }


            this.allfav.push(singlelist);
            //console.log(element.tracks);
        });
       // console.log(this.allfav);
      })
      .catch(e=>{
        alert(e);
      })
    })
    .catch((e) => {
      throw e;
    });
      }
    })
  }



  addToFavorites(music:Music,list:string):void{
    this.favoritesService.addMusicToList(music,Number(list));
    console.log(music);
    // console.log(this.favoritesService);
     //console.log (localStorage.getItem('Favorites'));
  }


  addToFav(music:Music, favName:string):void{
    // let addtracks:string[] = [];
    // let list = '';
    // this.allfav.forEach(element => {
    //   if (element.name == favName){
    //   list = element.tracks;
    //   }
    // });
    // addtracks.push(music.track_id);
    // addtracks.push(list);
    // console.log("list is: "+list);
    // console.log("input is ："+addtracks);
    const token = localStorage.getItem('Token');
    let url = "http://localhost:3000/playlist/updatelist";

    let addlist = {
      'name': favName,
      'list': [music.track_id]
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
          //alert("add successful");
          console.log(data);
      })
      .catch(e=>{
        alert(e);
      })
    })
    .catch((e) => {
      throw e;
    });

  };



}

export class fav{

  name!: string;
  tracks!:string;
}



