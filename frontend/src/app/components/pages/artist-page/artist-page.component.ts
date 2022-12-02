import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { response } from 'express';
import { FavoritesService } from 'src/app/services/favorites.service';
import { MusicService } from 'src/app/services/music.service';
import { UserService } from 'src/app/services/user.service';
import { Music } from 'src/app/shared/models/music';
import { PlayList } from 'src/app/shared/models/playlist';
import { Review } from 'src/app/shared/models/review';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-artist-page',
  templateUrl: './artist-page.component.html',
  styleUrls: ['./artist-page.component.css']
})
export class ArtistPageComponent {
  playlist!: PlayList;
  tracks!: string[];
  music!: Music[];
  length!:Number[];
  rating:number = 0;
  getListReview:Review[] = [];
  listName!:string;
  constructor(activatedRoute:ActivatedRoute, musicService:MusicService,
    private favoritesService:FavoritesService, private router: Router,userservice : UserService){
      this.music = [];
      this.length = Array(favoritesService.getFavoritesLen()).fill(1).map((x,i)=>i+1);
    activatedRoute.params.subscribe(async (params)=>{
      if(params['artist']) {
        this.listName = params['artist'];
        userservice.getListReview(this.listName)
        .then(response=>{this.getListReview = response});
        await musicService.getArtistByName(params['artist'])
        .then(async response => {
          this.playlist = response;
          this.tracks = this.playlist.tracks;
        });
        if (this.tracks.length > 0){
          this.tracks.forEach(async trackid => {
            await musicService.getPlaylistByTracksId(trackid)
            .then(async response1 =>{
              // this.music.push(response1);
              //add youtube link
              let youtube_url = `https://www.googleapis.com/youtube/v3/search?key=AIzaSyCMhH3hryk87Faxajj641IOhGovJwIrY2A&type=video&part=snippet&maxResults=1&q=${response1.track_title.replace(/\s/g, "")}%${response1.artist_name.replace(/\s/g, "")}`;
              let req = new Request(youtube_url, {
                method: 'GET',
              });
              await fetch(req)
              .then(async response2 => {
                await response2.json()
                .then(data=>{
                  console.log(data);
                  response1.track_url = "https://www.youtube.com/embed/"+data.items[0].id.videoId;
                  response1.track_banner = data.items[0].snippet.thumbnails.high.url;
                  this.music.push(response1);
                })
              })
            })
          });
        }
      }
    })
  }
  addMusicToList(music: Music, index:string){
    this.favoritesService.addMusicToList(music,Number(index));
  }
  addToFavorites(){
    this.favoritesService.addToFavorites(this.playlist);
    this.router.navigateByUrl('/favorites-page');
  }

  onSubmit(stars: Number, review: string){
    let url = "http://localhost:3000/playlist/addreview";
    const token = localStorage.getItem('Token');

    let review_data = { 'list_name': this.listName, 'rating':stars, 'content':review};

    let request = new Request(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer '+ token
      },
      body: JSON.stringify(review_data)
    });
    fetch(request)
    .then((response) => {
      if (response.ok){
        alert('Review has submit!');
        window.location.reload();

      } else {
        response.json()
        .then(data => {
          alert(data.error);
        })
      }
    })
    .catch((e) => {
      throw e;
    });
  }
}
