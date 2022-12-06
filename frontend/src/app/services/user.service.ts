import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Review } from '../shared/models/review';
import { User } from '../shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject = new BehaviorSubject<User>(new User());
  public userObservable:Observable<User>;
  constructor() {
    this.userObservable = this.userSubject.asObservable();
  }

  getUserInAdmin(){
    let allUser:User[] = [];
    const token = localStorage.getItem('Token');
    let url = localStorage.getItem('localpwd') + "/admin/getallusers";
    let request = new Request(url, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer '+ token
      }
    });
    return fetch(request)
    .then(response => {
      if (response.ok){
        return response.json()
        .then(data => {
          allUser = data;
          return allUser;
        })
      } else {
        return allUser;
      }
    })
  }

  getUserReview(){
    let getReview:Review[] = [];

    const token = localStorage.getItem('Token');
    let url = localStorage.getItem('localpwd') + "/admin/getallreview";
    let request = new Request(url, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer '+ token
      }
    });
    return fetch(request)
    .then(response => {
      if (response.ok){
        return response.json()
        .then(data => {
          getReview = data;
          return getReview;
        })
      } else {
        return getReview;
      }
    })
  }

  getListReview(list:string){
    let getListReview:Review[] = [];

    const token = localStorage.getItem('Token');
    let url = localStorage.getItem('localpwd') + "/playlist/getreview/" + list;
    let request = new Request(url, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer '+ token
      }
    });
    return fetch(request)
    .then(response => {
      if (response.ok){
        return response.json()
        .then(data => {
          getListReview = data;
          return getListReview;
        })
      } else {
        return getListReview;
      }
    })
  }
}
