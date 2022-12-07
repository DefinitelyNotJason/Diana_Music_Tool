import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  loginForm!:FormGroup;
  isSubmitted = false;
  pwd = localStorage.getItem('localpwd');
  local= this.pwd+'/user/auth/google';
  constructor(private formBuilder:FormBuilder,private router:Router){}

  ngOnInit(): void{
    this.loginForm = this.formBuilder.group({
      email:[''],
      password:['']
    });
  };

  submit(){
    let url = localStorage.getItem('localpwd') + "/user/login";
    const user = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };
    let request = new Request(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify(user)
    });
    fetch(request)
    .then((response) => {
      response.json()
      .then(data => {
        if (data.success){
          localStorage.setItem('Token',data.token);
          window.location.href="/";
          this.router.navigateByUrl('/');
        } else {
          alert(data.error);
        };
      })
      .catch(e=>{
        alert(e);
      });
    })
    .catch((e) => {
      throw e;
    });
  };
};
