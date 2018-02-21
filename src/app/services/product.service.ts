import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/Observable';

import { Product } from '../types/product';

@Injectable()
export class ProductService {

  constructor(private _http: HttpClient) { }

  create(product: Product): Observable<any> {
    return this._http.post(`${environment.apiUrl}/api/products`, product);
  }

}
