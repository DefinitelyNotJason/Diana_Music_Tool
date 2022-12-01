import { Token } from '@angular/compiler';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FavoritesService } from 'src/app/services/favorites.service';
import { LoginPageComponent } from '../../pages/login-page/login-page.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  favoritesQuantity = 0;
  userName:String = "";
  isLogin = false;
  isAdmin = true;
  constructor(activatedRoute :ActivatedRoute ,favoritesService:FavoritesService){
   //localStorage.removeItem("Token");
    favoritesService.getFavoritesObservable().subscribe((newFavorites) => {
      this.favoritesQuantity = newFavorites.totalCount;
    });
    console.log(localStorage.getItem('Token'));
    if(localStorage.getItem('Token')){
      const token = localStorage.getItem('Token');
      console.log(token);
      let url = "http://localhost:3000/user/getuser";
      let request = new Request(url, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          'Authorization': 'Bearer '+token
        }
      });
      fetch(request)
      .then((response) => {
        if (response.ok){
          response.json()
          .then(data => {
            console.log(data);
            this.userName = data.username;
            console.log(data.username);
          })
        } else {
          response.json()
          .then(data => {
            alert(data.error);
            this.logout();
            this.isLogin = false;
          })
        }
      })
      .catch((e) => {
        throw e;
      });
      this.isLogin = true;
    }
  }
  logout():void{
    localStorage.removeItem("Token");
    window.location.href="/";
  }
}
