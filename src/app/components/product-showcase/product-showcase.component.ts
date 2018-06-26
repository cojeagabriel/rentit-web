import { ReviewService } from './../../services/review.service';
import { ProductService } from 'app/services/product.service';
import { Component, OnInit, Input } from '@angular/core';
import { Product } from '../../types/product';
import { ImageService } from '../../image.service';
import { UserService } from '../../services/user.service';
import { Observable } from 'rxjs';
import { User } from '../../types/user';
import { Review } from '../../types/review';

@Component({
  selector: 'app-product-showcase',
  templateUrl: './product-showcase.component.html',
  styleUrls: ['./product-showcase.component.scss']
})
export class ProductShowcaseComponent implements OnInit {

  review: Review;
  user: User;
  @Input() product: Product;

  constructor(
    private productService: ProductService,
    private imageService: ImageService,
    private userService: UserService,
    private reviewService: ReviewService
  ) { }

  ngOnInit() {
    this.userService.getById(this.product._ownerId)
      .catch(err => {
        return Observable.throw(new Error(`${err.status} ${err.msg}`));
      })
      .subscribe(user => {
        this.user = user[0];
      });
    this.reviewService.getReviewsByProductId(this.product._id)
      .catch(err => {
        return Observable.throw(new Error(`${err.status} ${err.msg}`));
      })
      .subscribe(reviews => {
        this.review = reviews[reviews.length-1];
      });
  }

  get mainImageUrl(): string {
    return this.product ? this.imageService.getImageUrl(this.product.images[0]) : '';
  }

}
