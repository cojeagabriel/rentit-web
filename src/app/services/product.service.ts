import { Product } from './../types/product.d';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/Observable';
import { Image } from '../types/image';

@Injectable()
export class ProductService {

  constructor(private http: HttpClient) { }

  create(product: Product): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/products`, product);
  }

  update(product: Product, id: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/api/products/update/${id}`, product);
  }

  delete(product: Product): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/products/delete`, product);
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

  removeImage(product: Product, image: Image) {
    return this.http.delete<Product>(`${environment.apiUrl}/api/products/${product._id}/images/${image._id}`);
  }
}
