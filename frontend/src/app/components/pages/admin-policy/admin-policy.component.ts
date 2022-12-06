import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-policy',
  templateUrl: './admin-policy.component.html',
  styleUrls: ['./admin-policy.component.css']
})
export class AdminPolicyComponent {
  security_policy!:String;
  constructor(){
    this.getSecurity()
    .then(res => {
      this.security_policy = res;
      const securty_elem = window.document.getElementById('security_policy') as HTMLInputElement;
      if (securty_elem){
        securty_elem.value = `${this.security_policy}`;
      }
    });

    this.getAUP()
    .then(res => {
      const aup_elem = window.document.getElementById('aup_policy') as HTMLInputElement;
      if (aup_elem){
        aup_elem.value = `${res}`;
      }
    });

    this.getDMCA()
    .then(res => {
      const aup_elem = window.document.getElementById('dmca_policy')as HTMLInputElement;
      if (aup_elem){
        aup_elem.value = `${res}`;
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

  sec_submit(sec:string){
    let url = "http://localhost:3000/admin/updatepolicy";
    const token = localStorage.getItem("Token");
    let sec_p = { 'content': sec , 'type': 'security'};
    let request = new Request(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer '+ token
      },
      body: JSON.stringify(sec_p)
    });
    fetch(request)
    .then((response) => {
      response.json()
      .then(data => {
        console.log(data);
       alert("change saved");
      })
      .catch(e=>{
        alert(e);
      });
    })
    .catch((e) => {
      throw e;
    });

  }

  aup_submit(aup:string){
    let url = "http://localhost:3000/admin/updatepolicy";
    let token = localStorage.getItem("Token");
    let aup_p = { 'content': aup , 'type': 'AUP'};
    let request = new Request(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer '+ token
      },
      body: JSON.stringify(aup_p)
    });
    fetch(request)
    .then((response) => {
      response.json()
      .then(data => {
       alert("change saved");
      })
      .catch(e=>{
        alert(e);
      });
    })
    .catch((e) => {
      throw e;
    });


  }

  dmca_submit(dmca:string){
    let url = "http://localhost:3000/admin/updatepolicy";
    let token = localStorage.getItem("Token");
    let dmca_p = { 'content': dmca , 'type': 'DMCA'};
    let request = new Request(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer '+ token
      },
      body: JSON.stringify(dmca_p)
    });
    fetch(request)
    .then((response) => {
      response.json()
      .then(data => {
       alert("change saved");
      })
      .catch(e=>{
        alert(e);
      });
    })
    .catch((e) => {
      throw e;
    });


  }

}
