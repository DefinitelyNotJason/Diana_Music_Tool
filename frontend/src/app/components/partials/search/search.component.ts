import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  search = '';
  constructor(activatedRoute:ActivatedRoute,private router:Router){
    activatedRoute.params.subscribe((params)=>{
      if(params['search']) this.search = params['search'];
    })
  }

  searchterm(term:string):void{
    if (!term.length){
      alert('Please enter at least one search keyword!');
    } else if (term == "猫中毒"){
      alert("嘉然可爱捏~");
      window.location.href = 'https://www.bilibili.com/video/BV1FX4y1g7u8/?spm_id_from=333.337.search-card.all.click&vd_source=c31bdd700c6bc2753581069ba3c20513';
    }
    else if(term) {
      this.router.navigateByUrl('/search/' + term);
    }
    else this.router.navigateByUrl('/');
  }
}
