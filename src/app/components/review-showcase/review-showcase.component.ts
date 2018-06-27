import { ImageService } from 'app/image.service';
import { Component, OnInit } from '@angular/core';
import { ReviewService } from '../../services/review.service';
import { Review } from '../../types/review';
import { Observable } from 'rxjs';
import { Product } from '../../types/product';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-review-showcase',
  templateUrl: './review-showcase.component.html',
  styleUrls: ['./review-showcase.component.scss']
})
export class ReviewShowcaseComponent implements OnInit {

  reviews: Review[];
  products: Product[] = [];

  constructor(
    private reviewService: ReviewService,
    private productService: ProductService,
    private imageService: ImageService
  ) { }

  ngOnInit() {
    this.reviewService.getReviews()
      .catch(err => {
        return Observable.throw(new Error(`${err.status} ${err.msg}`));
      })
      .subscribe(reviews => {
        this.reviews = reviews.sort(function (a, b) {
          if (a.rating < b.rating) { return 1; }
          else if (a.rating == b.rating) { return 0; }
          else { return -1; }
        }).slice(0, 3);
        this.reviews.forEach((review, index) => {
          this.productService.getById(review._productId)
            .catch(err => {
              return Observable.throw(new Error(`${err.status} ${err.msg}`));
            })
            .subscribe(product => {
              this.products[index] = product[0];
            });
        });
      });
  }

  mainImageUrl(product: Product): string {
    return product ? this.imageService.getImageUrl(product.images[0]) : '';
  }

}
