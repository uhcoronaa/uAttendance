import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {}

  getToken(){
    let token = localStorage.getItem('token')
    if(token){
      return true
    }
    return false
  }

}
