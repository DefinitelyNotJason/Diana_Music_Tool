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

  disableActive(email: string){
    let url = localStorage.getItem('localpwd') + "/admin/deactivateuser";
    const token = localStorage.getItem('Token');

    let email_data = { 'email': email }

    let request = new Request(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer '+ token
      },
      body: JSON.stringify(email_data)
    });
    fetch(request)
    .then((response) => {
      if (response.ok){
        alert('User deactivate success!');
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

  enableActive(email:string){
    let url = localStorage.getItem('localpwd') + "/admin/activateuser";
    const token = localStorage.getItem('Token');

    let email_data = { 'email': email }

    let request = new Request(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer '+ token
      },
      body: JSON.stringify(email_data)
    });

    fetch(request)
    .then((response) => {
      if (response.ok){
        alert('User activate success!');
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

  enableAdmin(email:string){
    let url = localStorage.getItem('localpwd') + "/admin/grantadmin";
    const token = localStorage.getItem('Token');

    let email_data = { 'email': email }

    let request = new Request(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer '+ token
      },
      body: JSON.stringify(email_data)
    });
    fetch(request)
    .then((response) => {
      if (response.ok){
        alert('enable admin success!');
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

  disableReview(_id: string){
    let url = localStorage.getItem('localpwd') + "/admin/hiddenreview";
    const token = localStorage.getItem('Token');

    let review_id = { 'id': _id }

    let request = new Request(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer '+ token
      },
      body: JSON.stringify(review_id)
    });

    fetch(request)
    .then((response) => {
      if (response.ok){
        alert('disable review success!');
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

  enableReview(_id:string){
    let url = localStorage.getItem('localpwd') + "/admin/publicreview";
    const token = localStorage.getItem('Token');

    let review_id = { 'id': _id }

    let request = new Request(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer '+ token
      },
      body: JSON.stringify(review_id)
    });

    fetch(request)
    .then((response) => {
      if (response.ok){
        alert('enable review success!');
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
