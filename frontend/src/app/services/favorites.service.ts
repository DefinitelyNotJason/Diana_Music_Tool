import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FavoriteList } from '../shared/models/favoritelist';
import { Favorites } from '../shared/models/favorites';
import { Music } from '../shared/models/music';
import { PlayList } from '../shared/models/playlist';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private favorites:Favorites = this.getFavoritesToLocalStorage();
  private favoritesSubject: BehaviorSubject<Favorites> = new BehaviorSubject(this.favorites);

  constructor() { }

  getFavoritesLen():number{
    return this.favorites.artists.length;
  }

  // addEmptyList():void{
  //   if(this.favorites.artists.length < 20){
  //     this.favorites.artists.push(new FavoriteList(new PlayList()));
  //     this.setFavoritesToLocalStorage();
  //   }
  // }

  addNewList():void{
    let inputName !: string;
    let inputDescription !: string;
    const a = document.getElementById('listName') as HTMLInputElement | null;
    const b = document.getElementById('Description') as HTMLInputElement | null;
    if (a != null) {
      inputName = a.value;
      }
     if(inputName.length == 0){
        alert("list name cannot be null");
        return;
      }
    if (b != null) {
      inputDescription = b.value;
      }

    //console.log(inputName);
    //console.log(inputDecription);


      if(this.favorites.artists.length < 20){
        let newList = new FavoriteList(new PlayList());
        newList.music.name = inputName;
        newList.music.description = inputDescription;
        console.log(newList);
        this.favorites.artists.push(newList);
        this.setFavoritesToLocalStorage();
      }

  }




  addMusicToList(music:Music,list:number):void{
    // if(!this.favorites.artists[list-1].music.tracks.find(index => index === music.tracks))
    // this.favorites.artists[list-1].music.tracks.push(music.tracks);
    // this.setFavoritesToLocalStorage();
  }

  addToFavorites(music:PlayList):void{
    let favoritelist = this.favorites.artists.find(i => i.music.name === music.name);
    if(favoritelist)
      return;

    this.favorites.artists.push(new FavoriteList(music));
    this.setFavoritesToLocalStorage();
  }

  removeFromFavorites(name:string):void{
    this.favorites.artists = this.favorites.artists.filter(i => i.music.name != name);
    this.setFavoritesToLocalStorage();
  }

  editDescription(music:PlayList, edit: string):void{
    // const b = document.getElementById('editDescription') as HTMLInputElement | null;
    // let inputDescription !: string;
    // if (b != null) {
      let inputDescription = edit;
      // }
      console.log(edit);
    let favoritelist = this.favorites.artists.find(i => i.music.name === music.name);
    //console.log(favoritelist);
    //console.log(favoritelist?.music.description);
    //console.log(inputDescription);
    if(favoritelist){
    favoritelist.music.description = inputDescription;
  //  console.log(favoritelist);
     // let a =favoritelist.music.name;
    this.setFavoritesToLocalStorage();
    }
  }

  publicOrNot(music:PlayList, TorF: string):void{
    let result = TorF;
    console.log(TorF);
    const token = localStorage.getItem('Token');

    let favoritelist = this.favorites.artists.find(i => i.music.name === music.name);
    if(favoritelist){
    let url = "http://localhost:3000/playlist/updateplaylist";

    console.log(favoritelist.music.name);
    console.log(favoritelist.music.description);
    console.log(result);
    const user = {
      name:favoritelist.music.name,
      description:favoritelist.music.description,
      public: result
    };
    let request = new Request(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer '+ token
      },
      body: JSON.stringify(user)
    });

    fetch(request)
    .then((response) => {
      if (response.ok){
        response.json()
        .then(data => {
          alert('hidden success!');

        })
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
  deleteTrack(music:PlayList):void{

  }




  // changeQuantity(artist_name:string, quantity:number){
  //   let favoriteartist = this.favorites.artists.find(i => i.music.artist_name === artist_name);
  //   if(!favoriteartist) return;

  //   favoriteartist.quantity = quantity;
  //   this.setFavoritesToLocalStorage();
  // }

  clearFavorites(){
    this.favorites = new Favorites();
    this.setFavoritesToLocalStorage();
  }

  getFavoritesObservable():Observable<Favorites>{
    return this.favoritesSubject.asObservable();
  }

  private setFavoritesToLocalStorage():void{
    this.favorites.totalCount = this.favorites.artists
    .reduce((prevSum,current) => prevSum+current.quantity ,0);

    const favoritesJson = JSON.stringify(this.favorites);
    localStorage.setItem('Favorites',favoritesJson);
    this.favoritesSubject.next(this.favorites);
  }

  private getFavoritesToLocalStorage():Favorites{
    const favoritesJson = localStorage.getItem('Favorites');
    return favoritesJson ? JSON.parse(favoritesJson):new Favorites();
  }
}
