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
    let url = "http://localhost:3000/"
    let request = new Request(url, {
    method: 'GET'
      });
      fetch(request)
    .then(response => {
      console.log("hello");
    })

    this.isSubmitted = true;
    if(this.loginForm.invalid) return;

    alert(`email: ${this.fc['email'].value} ,
    password: ${this.fc['password'].value}`)
  }
}
