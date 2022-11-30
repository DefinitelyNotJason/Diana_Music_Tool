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

  addEmptyList():void{
    if(this.favorites.artists.length < 20){
      this.favorites.artists.push(new FavoriteList(new PlayList()));
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
