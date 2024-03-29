import { Component } from '@angular/core';
import { FavoritesService } from 'src/app/services/favorites.service';

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
  constructor(favoritesService:FavoritesService){
   //localStorage.removeItem("Token");
   localStorage.setItem('localpwd', 'http://localhost:3000');
   if (localStorage.getItem('Token')){
    favoritesService.getAllPlaylist()
    .then(response=>{
      this.favoritesQuantity = response.length;
    })
   };
    if(localStorage.getItem('Token')){
      const token = localStorage.getItem('Token');
      let url = localStorage.getItem('localpwd') +"/user/getuser";
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
            if(data.isActive){
              this.userName = data.username;
              this.isAdmin = data.isAdmin;
              this.isLogin = true;
            }else{
              localStorage.removeItem("Token");
              alert("Sorry, your acount is deactive now. Please contact Admin: wdtjx95@gmail.com");
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
