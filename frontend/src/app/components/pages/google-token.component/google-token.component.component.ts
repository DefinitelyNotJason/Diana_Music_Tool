import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-google-token.component',
  templateUrl: './google-token.component.component.html',
  styleUrls: ['./google-token.component.component.css']
})
export class GoogleTokenComponentComponent {
  constructor(activatedRoute: ActivatedRoute, private router: Router){
    activatedRoute.params.subscribe(async (params)=>{
      localStorage.setItem('Token', params['token']);
      window.location.href="/";
      this.router.navigateByUrl('/');
    })
  };
};
