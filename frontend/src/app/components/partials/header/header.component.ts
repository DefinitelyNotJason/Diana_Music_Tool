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
  isAdmin !: boolean;
  isActive !: boolean;
  constructor(activatedRoute :ActivatedRoute ,favoritesService:FavoritesService){
   //localStorage.removeItem("Token");
   if (localStorage.getItem('Token')){
    favoritesService.getAllPlaylist()
    .then(response=>{
      this.favoritesQuantity = response.length;
    })
   };
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
            if(data.isActive){
              this.userName = data.username;
              this.isAdmin = data.isAdmin;
              this.isLogin = true;
            }else{
              localStorage.removeItem("Token");
              alert("Sorry, your acount is deactive now. Please contact Admin: admin@admin.com");
            }
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
    }
  };

  logout():void{
    localStorage.removeItem("Token");
    window.location.href="/";
  };

  homeRefresh(){
    window.location.href="/";
  };
};
