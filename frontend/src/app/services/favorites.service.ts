import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FavoriteArtist } from '../shared/models/favoriteartist';
import { Favorites } from '../shared/models/favorites';
import { Music } from '../shared/models/music';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private favorites:Favorites = this.getFavoritesToLocalStorage();
  private favoritesSubject: BehaviorSubject<Favorites> = new BehaviorSubject(this.favorites);

  constructor() { }

  addToFavorites(music:Music):void{
    let favoriteartist = this.favorites.artists.find(i => i.music.artist_name === music.artist_name);
    if(favoriteartist)
      return;

    this.favorites.artists.push(new FavoriteArtist(music));
    this.setFavoritesToLocalStorage();
  }

  removeFromFavorites(artist_name:string):void{
    this.favorites.artists = this.favorites.artists.filter(i => i.music.artist_name != artist_name);
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
