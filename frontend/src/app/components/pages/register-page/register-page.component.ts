import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

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
    this.registerForm = this.formBuilder.group({username:[''], email:[''],password:['']});
  };

  submit(){
    let url = localStorage.getItem('localpwd') + "/user/register";
    const user = {
      username: this.registerForm.value.username,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password
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
};
