import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Comment } from './../types/comment.d';
import { environment } from 'environments/environment';

@Injectable()
export class CommentService {

  constructor(
    private http: HttpClient
  ) { }

  create(comment: Comment): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/comments`, comment);
  }

  update(comment: Comment, id: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/api/comments/update/${id}`, comment);
  }

  delete(comment: Comment): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/comments/delete`, comment);
  }

  getComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${environment.apiUrl}/api/comments`);
  }

  getCommentsBySenderId(id: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${environment.apiUrl}/api/comments/sender${id}`);
  }

  getCommentsByProductId(id: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${environment.apiUrl}/api/comments/product${id}`);
  }

  getById(id: string): Observable<Comment> {
    return this.http.get<Comment>(`${environment.apiUrl}/api/comments/${id}`);
  }

}
