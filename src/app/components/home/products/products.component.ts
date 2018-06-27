import { ImageService } from './../../../image.service';
import { ProductService } from './../../../services/product.service';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, AfterViewInit, ViewChildren, QueryList, Input  } from '@angular/core';
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
  @Input() title: string;
  @Input() category: string;
  @Input() owner: string;
  @Input() id: string;

  constructor(
    private productService: ProductService,
    private imageService: ImageService
  ) { }

  ngOnInit() {
    if(this.category){
      this.productService.getProductsByCategory(this.category)
        .catch(err => {
          return Observable.throw(err);
        })
        .subscribe(products => {
          this.products = products.reverse();
        })
    }
    else if(this.owner){
      this.productService.getProductsByOwnerId(this.owner)
        .catch(err => {
          return Observable.throw(err);
        })
        .subscribe(products => {
          this.products = products.reverse();
        })
    }
    else{
      this.productService.getProducts()
        .catch(err => {
          return Observable.throw(err);
        })
        .subscribe(products => {
          this.products = products.reverse().slice(0,10);
        })
    }
  }

  ngAfterViewInit() {
    this.things.changes.subscribe(t => {
      var swiper = new Swiper('.swiper-container'+this.id, {
        slidesPerView: 'auto',
        spaceBetween: 15,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next'+this.id,
          prevEl: '.swiper-button-prev'+this.id,
        },
      });
    })
  }

  getProductImageUrl(product: Product): string {
    if(product.images)
      return this.imageService.getImageStyleUrl(product.images[0]);
    else
      return '';
    // return product ? this.imageService.getImageStyleUrl(product.images[0]) : '';
  }

}
