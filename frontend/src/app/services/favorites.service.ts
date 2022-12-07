import { Injectable } from '@angular/core';
import { PlayList } from '../shared/models/playlist';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  constructor() {}

  addNewList(new_listname:string, new_description:string){
    if (new_description == ""){
      new_description = " ";
    }
    let url = localStorage.getItem('localpwd') + "/playlist/savelist";
    let token = localStorage.getItem('Token');
    let data = {
      "name":new_listname,
      "description":new_description
    }
    let request = new Request(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer '+token
      },
      body: JSON.stringify(data)
    });
    fetch(request)
    .then(response => {
      response.json()
      .then(data=>{
        if (data.success){
          alert('Playlist create success!');
          window.location.reload();
        } else {
          alert(data.error);
        }
      })
    })
    .catch(err =>{
      alert(err);
    })
  };

  deleteList(listname:string) {
    let url = localStorage.getItem('localpwd') + "/playlist/deletelist";
    let token = localStorage.getItem('Token');
    let data = {
      "name":listname,
    }
    let request = new Request(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer '+token
      },
      body: JSON.stringify(data)
    });
    fetch(request)
    .then(response => {
      response.json()
      .then(data=>{
        if (data.success){
          alert('Playlist delete success!');
          window.location.reload();
        } else {
          alert(data.error);
        }
      })
    })
    .catch(err =>{
      alert(err);
    })
  };

  updateList(playlist_name:string, public_selection:string, description:string){
    if (description == ""){
      description = " ";
    }
    let url = localStorage.getItem('localpwd') + "/playlist/updateplaylist";
    let token = localStorage.getItem('Token');
    let data = {
      "name":playlist_name,
      "description":description,
      "public":JSON.parse(public_selection)
    }
    let request = new Request(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer '+token
      },
      body: JSON.stringify(data)
    });
    fetch(request)
    .then(response => {
      response.json()
      .then(data=>{
        if(data.success){
          alert('Playlist update success!');
          window.location.reload();
        } else {
          alert(data.error);
        }
      })
      .catch(err=>{
        alert(err);
      })
    })
    .catch(err =>{
      alert(err);
    });
  };

  deleteTrack(listname:string, tracks:string[], track_select:string){
    tracks = tracks.filter(e => e !== track_select);
    let url = localStorage.getItem('localpwd') + "/playlist/updatelist";
    let token = localStorage.getItem('Token');
    let data = {
      "name":listname,
      "list":tracks
    }
    let request = new Request(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer '+token
      },
      body: JSON.stringify(data)
    });
    fetch(request)
    .then(response => {
      response.json()
      .then(data=>{
        if(data.success){
          alert('Track delete success!');
          window.location.reload();
        } else {
          alert(data.error);
        }
      })
      .catch(err=>{
        alert(err);
      })
    })
    .catch(err =>{
      alert(err);
    });
  };

  async getAllPlaylist():Promise<PlayList[]>{
    let r_data:PlayList[] = [];
    let url = localStorage.getItem('localpwd') + "/playlist/getallplaylists";
    let token = localStorage.getItem('Token');
    let request = new Request(url, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer '+token
      }
    });
    const response = await fetch(request);
    if (response.ok) {
      return response.json()
        .then(data => {
          r_data = data;
          return r_data;
        });
    } else {
      return r_data;
    };
  };
};
