import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IUserRegister } from 'src/app/shared/interfaces/IUserRegister';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent {
  registerForm!:FormGroup;
  isSubmitted = false;

  constructor(private formBuilder: FormBuilder, private router:Router){}

  ngOnInit():void{
    this.registerForm = this.formBuilder.group({
      username:['',[Validators.required, Validators.minLength(5)]],
      email:['',[Validators.required, Validators.email]],
      password:['',[Validators.required, Validators.minLength(5)]]
    });
  }

  get fc(){
    return this.registerForm.controls;
  }

  submit(){
    let url = localStorage.getItem('localpwd') + "/user/register";
    const fv = this.registerForm.value;
    const user:IUserRegister = {
      username:fv.username,
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
          alert('Registration success!');
          if (window.confirm("A confirm email was send to your email box, please confirm that!")){
            this.router.navigateByUrl('/login');
          };
        } else {
          alert(data.error);
        }
      })
      .catch(e=>{
        alert(e)
      });
    })
    .catch((e) => {
      throw e;
    });
  };
}
