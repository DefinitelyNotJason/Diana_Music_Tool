import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent {

  constructor(private activatedRoute: ActivatedRoute,private router:Router){}
  changePassword(password: string){
    let url = "http://localhost:3000/user/password-change";
    const token = localStorage.getItem('Token');

    let new_pass = { 'newpassword': password }

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
      if (response.ok){
        console.log(response);
        localStorage.removeItem('Token');
        alert('password change success!');
        //window.location.reload();
        this.router.navigateByUrl('');
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
  }
}
