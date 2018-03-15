import { Product } from './../types/product.d';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ProductService {

  constructor(private http: HttpClient) { }

  create(product: Product): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/products`, product);
  }

  update(product: Product, id: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/api/products/update/${id}`, product);
  }

  getProducts(): Observable<Product[]>{
    return this.http.get<Product[]>(`${environment.apiUrl}/api/products`);
  }

  getProductsByOwnerId(id: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.apiUrl}/api/products/owner${id}`);
  }

  getById(id: string): Observable<Product>{
    return this.http.get<Product>(`${environment.apiUrl}/api/products/${id}`);
  }

  getCategories(){
    return this.http.get(`${environment.apiUrl}/api/products/types`);
  }

}
