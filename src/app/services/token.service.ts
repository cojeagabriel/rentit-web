import { Injectable } from '@angular/core';

@Injectable()
export class TokenService {

  constructor() { }

  setToken(token: string){
    localStorage.setItem('jwtToken', token);
  }

  getToken(): string {
    return localStorage.getItem('jwtToken') || '';
  }

  resetToken() {
    localStorage.removeItem('jwtToken');
  }

}
