import { Product } from './../types/product.d';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/Observable';
import { Image } from 'app/types/image';
import { TempProduct } from 'app/types/temp-product';

@Injectable()
export class ProductService {

  constructor(private http: HttpClient) { }

  create(product: Product): Observable<any> {
    return this.http.post<Product>(`${environment.apiUrl}/api/products`, product);
  }

  createTemp(): Observable<TempProduct> {
    return this.http.post<TempProduct>(`${environment.apiUrl}/api/products/temp`, {});
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

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.apiUrl}/api/products/category${category}`);
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

  removeTempImage(tempProductId: string, image: Image) {
    return this.http.delete<Product>(`${environment.apiUrl}/api/products/temp/${tempProductId}/images/${image._id}`);
  }
}
