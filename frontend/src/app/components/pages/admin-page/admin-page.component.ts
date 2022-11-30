import { Component } from '@angular/core';
import { json, response } from 'express';
import { UserService } from 'src/app/services/user.service';
import { Review } from 'src/app/shared/models/review';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent {
  getUser:User[] =  [];
  getReview:Review[] = [];
  constructor(userservice : UserService){
    userservice.getUserInAdmin()
    .then(response=> {this.getUser = response});
    userservice.getUserReview()
    .then(response=>{this.getReview = response});
  }
}
