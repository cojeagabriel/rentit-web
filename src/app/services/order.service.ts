import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { Order } from '../types/order';
import { environment } from 'environments/environment';

@Injectable()
export class OrderService {

  private order: Order;

  constructor(
    private http: HttpClient
  ) { }

  create(order: Order): Observable<any>{
    return this.http.post(`${environment.apiUrl}/api/orders`, order);
  }

  update(order: Order, id: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/api/orders/update/${id}`, order);
  }

  setOrder(order: Order):void{
    this.order = order;
  }

  getOrder():Order{
    return this.order;
  }

  getOrdersByOwnerId(id: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${environment.apiUrl}/api/orders/owner${id}`);
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${environment.apiUrl}/api/orders/${id}`);
  }
}
