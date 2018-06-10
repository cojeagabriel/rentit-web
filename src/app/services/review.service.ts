import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/Observable';
import { Review } from './../types/review.d';

@Injectable()
export class ReviewService {

  constructor(
    private http: HttpClient
  ) { }

  create(product: Review): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/reviews`, product);
  }

  update(product: Review, id: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/api/reviews/update/${id}`, product);
  }

  delete(product: Review): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/reviews/delete`, product);
  }

  getReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(`${environment.apiUrl}/api/reviews`);
  }

  getReviewsByUserId(id: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${environment.apiUrl}/api/reviews/user${id}`);
  }

  getReviewsByProductId(id: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${environment.apiUrl}/api/reviews/product${id}`);
  }

  getById(id: string): Observable<Review> {
    return this.http.get<Review>(`${environment.apiUrl}/api/reviews/${id}`);
  }


}
