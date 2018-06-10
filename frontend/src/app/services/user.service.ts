import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../types/user';
import { environment } from '../../environments/environment';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Injectable()
export class UserService {

  private _me$: ReplaySubject<User>= new ReplaySubject(1);

  constructor(
    private http: HttpClient,
  ) { }

  getMe(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/api/users/me`)
      .do(user => {
        this._me$.next(user);
      });
  }

  getById(id: string): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/api/users/${id}`);
  }

  get me$(): Observable<User> {
    return this._me$.asObservable();
  }

  update(user: User): Observable<any> {
    return this.http.put(`${environment.apiUrl}/api/users/update`, user);
  }
}
