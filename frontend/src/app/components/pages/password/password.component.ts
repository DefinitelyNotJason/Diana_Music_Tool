import { Component } from '@angular/core';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent {

  constructor(){}

  changePassword(password: string, e:Event){
    e.preventDefault();
    let url = localStorage.getItem('localpwd') + "/user/password-change";
    const token = localStorage.getItem('Token');
    let new_pass = { 'newpassword': password };
    let request = new Request(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer '+ token
      },
      body: JSON.stringify(new_pass)
    });
    fetch(request)
    .then((response) => {
      response.json()
      .then(data=>{
        if (data.success){
          localStorage.removeItem('Token');
          alert('Password update success!');
          window.location.href="/";
        } else {
          alert(data.error);
        };
      });
    })
    .catch((e) => {
      alert(e);
    });
  };
};
