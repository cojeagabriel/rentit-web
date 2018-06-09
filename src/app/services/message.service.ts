import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/Observable';
import { Message } from './../types/message.d';

@Injectable()
export class MessageService {

  constructor(
    private http: HttpClient
  ) { }

  create(product: Message): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/messages`, product);
  }

  update(product: Message, id: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/api/messages/update/${id}`, product);
  }

  delete(product: Message): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/messages/delete`, product);
  }

  getMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(`${environment.apiUrl}/api/messages`);
  }

  getMessagesBySenderId(id: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${environment.apiUrl}/api/messages/sender${id}`);
  }

  getMessagesByRecieverId(id: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${environment.apiUrl}/api/messages/reciever${id}`);
  }

  getById(id: string): Observable<Message> {
    return this.http.get<Message>(`${environment.apiUrl}/api/messages/${id}`);
  }

}
