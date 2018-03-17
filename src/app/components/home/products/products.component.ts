import { Router } from '@angular/router';
import { ProductService } from './../../../services/product.service';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, AfterViewInit, ViewChildren, QueryList  } from '@angular/core';
import { Product } from '../../../types/product';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, AfterViewInit {

  products: Product[];
  @ViewChildren('allTheseThings') things: QueryList<any>;

  constructor(
    private productService: ProductService,
    private router: Router
  ) { }

  ngOnInit() {
    
    this.productService.getProducts()
      .catch(err => {
        return Observable.throw(err);
      })
      .subscribe(products => {
        console.log('sub');
        this.products = products;
      })
      console.log('init');
  }

  ngAfterViewInit() {
    this.things.changes.subscribe(t => {
      var swiper = new Swiper('.swiper-container', {
        slidesPerView: 'auto',
        spaceBetween: 15,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      });
    })
  }

}
