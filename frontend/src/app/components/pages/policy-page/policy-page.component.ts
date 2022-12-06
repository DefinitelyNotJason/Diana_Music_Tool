import { Component } from '@angular/core';

@Component({
  selector: 'app-policy-page',
  templateUrl: './policy-page.component.html',
  styleUrls: ['./policy-page.component.css']
})
export class PolicyPageComponent {
  security_policy!:String;
  constructor(){
    this.getSecurity()
    .then(res => {
      this.security_policy = res;
      const securty_elem = window.document.getElementById('security_policy');
      if (securty_elem){
        securty_elem.innerHTML = `<h1>Privacy Policy for Diana Music Tool</h1> ${this.security_policy}`;
      }
    });

    this.getAUP()
    .then(res => {
      const aup_elem = window.document.getElementById('aup_policy');
      if (aup_elem){
        aup_elem.innerHTML = `<h1>AUP Policy for Diana Music Tool</h1> ${res}`;
      }
    });

    this.getDMCA()
    .then(res => {
      const aup_elem = window.document.getElementById('dmca_policy');
      if (aup_elem){
        aup_elem.innerHTML = `<h1>DMCA Policy for Diana Music Tool</h1> ${res}`;
      }
    });
  };

  async getSecurity():Promise<String>{
    let url = 'http://localhost:3000/admin/getpolicy/security';
    let req = new Request(url, {
      method: 'GET',
    });
    return fetch(req)
    .then(async res => {
      return res.json()
      .then(data=>{
        return data.data;
      });
    });
  };

  async getAUP():Promise<String>{
    let url = 'http://localhost:3000/admin/getpolicy/AUP';
    let req = new Request(url, {
      method: 'GET',
    });
    return fetch(req)
    .then(async res => {
      return res.json()
      .then(data=>{
        return data.data;
      });
    });
  };

  async getDMCA():Promise<String>{
    let url = 'http://localhost:3000/admin/getpolicy/DMCA';
    let req = new Request(url, {
      method: 'GET',
    });
    return fetch(req)
    .then(async res => {
      return res.json()
      .then(data=>{
        return data.data;
      });
    });
  };
}
