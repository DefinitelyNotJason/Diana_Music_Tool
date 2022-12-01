import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  loginForm!:FormGroup;
  isSubmitted = false;
  // static token: string;

  constructor(private formBuilder:FormBuilder,private router:Router,userService:UserService){}

  ngOnInit(): void{
    this.loginForm = this.formBuilder.group({
      email:['',[Validators.required,Validators.email]],
      password:['',Validators.required]
    });
  }

  get fc(){
    return this.loginForm.controls;
  }

  submit(){
    let url = "http://localhost:3000/user/login";
    const fv = this.loginForm.value;
    const user = {
      email:fv.email,
      password:fv.password
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
        }
      })
      .catch(e=>{
        alert(e);
      })
    })
    .catch((e) => {
      throw e;
    });
  };
}
