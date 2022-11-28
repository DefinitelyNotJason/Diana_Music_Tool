import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  loginForm!:FormGroup;
  isSubmitted = false;

  constructor(private formBuilder:FormBuilder){}

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
      if (response.ok){
        alert('Registration success!');
        response.json()
        .then(data => {
          alert(data.token);
          console.log(data);
        })
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

    // this.isSubmitted = true;
    // if(this.loginForm.invalid) return;

    // alert(`email: ${this.fc['email'].value} ,
    // password: ${this.fc['password'].value}`)
  }
}
