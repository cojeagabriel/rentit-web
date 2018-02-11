import { TokenService } from './token.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/do';

import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { User } from '../types/user';

interface TokenResponse {
  message: string;
  success: boolean;  
  token: string;
}

@Injectable()
export class AuthService {

  private authenticated$: BehaviorSubject<boolean>;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { 
    const authenticated = !!this.tokenService.getToken();
    this.authenticated$ = new BehaviorSubject(authenticated);
  }

  authenticate(email: string, password: string): Observable<any>{
    return this.http.post<TokenResponse>(`${environment.apiUrl}/api/users/authenticate`, {email, password})
      .do(res => {
        this.tokenService.setToken(res.token);
        this.authenticated$.next(true);
      });
  }

  authenticated(): Observable<boolean> {
    return this.authenticated$.asObservable()
  }

  register(user: User): Observable<any>{
    return this.http.post<TokenResponse>(`${environment.apiUrl}/api/users/register`, user)
      .do(res => {
        this.tokenService.setToken(res.token);
        this.authenticated$.next(true);
      });
  }

  delete(email: string, password: string): Observable<any>{
    return this.http.post(`${environment.apiUrl}/api/users/delete`, {email, password})
      .do(res => {
        this.logout();
      });
  }

  logout() {
    this.tokenService.resetToken();
    this.authenticated$.next(false);
  }

}
