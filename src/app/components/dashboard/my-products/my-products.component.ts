import { UserService } from './../../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { Product } from '../../../types/product';
import { ProductService } from '../../../services/product.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-my-products',
  templateUrl: './my-products.component.html',
  styleUrls: ['./my-products.component.scss']
})
export class MyProductsComponent implements OnInit {

  products: Product[];

  constructor(
    private productService: ProductService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userService.getMe()
      .subscribe(user => {
        this.productService.getProductsByOwnerId(user._id)
          .catch(err => {
            return Observable.throw(err);
          })
          .subscribe(products => {
            this.products = products;
          });
      });
    
  }

}
