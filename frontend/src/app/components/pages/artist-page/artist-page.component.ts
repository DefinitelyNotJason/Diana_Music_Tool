import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MusicService } from 'src/app/services/music.service';
import { UserService } from 'src/app/services/user.service';
import { Music } from 'src/app/shared/models/music';
import { PlayList } from 'src/app/shared/models/playlist';
import { Review } from 'src/app/shared/models/review';

@Component({
  selector: 'app-artist-page',
  templateUrl: './artist-page.component.html',
  styleUrls: ['./artist-page.component.css']
})
export class ArtistPageComponent {
  playlist:PlayList = {
    name:"",
    creator:"",
    number_tracks:0,
    tracks:[],
    playtime:'0',
    total_review_rating:0,
    total_review_time:0,
    review_rating:0,
    public:true,
    edit_date:''
  };
  tracks!: string[];
  music!: Music[];
  rating:number = 0;
  getListReview:Review[] = [];
  listName!:string;
  isLogin:Boolean = false;
  constructor(activatedRoute:ActivatedRoute, musicService:MusicService, userservice:UserService){
    if (localStorage.getItem('Token')){
      this.isLogin = true;
    };
    this.music = [];
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
              //add youtube link
              let youtube_url = `https://www.googleapis.com/youtube/v3/search?key=AIzaSyCMhH3hryk87Faxajj641IOhGovJwIrY2A&type=video&part=snippet&maxResults=1&q=${response1.track_title.replace(/\s/g, "")}%${response1.artist_name.replace(/\s/g, "")}`;
              let req = new Request(youtube_url, {
                method: 'GET',
              });
              await fetch(req)
              .then(async response2 => {
                await response2.json()
                .then(data=>{
                  if (data.items.length < 1){
                    response1.track_url = " ";
                    response1.track_banner = " ";
                    this.music.push(response1);
                  } else {
                    response1.track_url = "https://www.youtube.com/embed/"+data.items[0].id.videoId;
                    response1.track_banner = data.items[0].snippet.thumbnails.high.url;
                    this.music.push(response1);
                  };
                })
                .catch(e=>{
                  response1.track_url = " ";
                  response1.track_banner = " ";
                  this.music.push(response1);
                })
              })
            })
          });
        }
      }
    })
  };

  onSubmit(stars: Number, review: string){
    let url = localStorage.getItem('localpwd') + "/playlist/addreview";
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
  };
};
