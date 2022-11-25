import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { IUserRegister } from 'src/app/shared/interfaces/IUserRegister';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent {
  registerForm!:FormGroup;
  isSubmitted = false;

  returnUrl = '';

  constructor(private formBuilder: FormBuilder, private userService: UserService,
    private activatedRoute: ActivatedRoute){}

  ngOnInit():void{
    this.registerForm = this.formBuilder.group({
      username:['',[Validators.required, Validators.minLength(5)]],
      email:['',[Validators.required, Validators.email]],
      password:['',[Validators.required, Validators.minLength(5)]]
    });

    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'];
  }

  get fc(){
    return this.registerForm.controls;
  }

  submit(){
    this.isSubmitted = true;
    if(this.registerForm.invalid) return;

    const fv = this.registerForm.value;
    const user:IUserRegister = {
      username:fv.username,
      email:fv.email,
      password:fv.password
    };

    // this.userService.register(user).subscribe(_=>{
    //   this.router.navigateByUrl(this.returnUrl);
    // })
  }
}
