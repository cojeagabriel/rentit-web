import { ImageService } from './../../../image.service';
import { ProductService } from './../../../services/product.service';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, AfterViewInit, ViewChildren, QueryList  } from '@angular/core';
import { Product } from '../../../types/product';
import { environment } from 'environments/environment';

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
    private imageService: ImageService
  ) { }

  ngOnInit() {

    this.productService.getProducts()
      .catch(err => {
        return Observable.throw(err);
      })
      .subscribe(products => {
        this.products = products;
      })
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
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      });
    })
  }

  getProductImageUrl(product: Product): string {
    return product ? this.imageService.getImageStyleUrl(product.images[0]) : '';
  }

}
