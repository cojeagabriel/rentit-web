import { ReviewService } from './../../services/review.service';
import { SearchPipe } from './../../search.pipe';
import { ProductService } from './../../services/product.service';
import { Component, OnInit } from '@angular/core';
import { Product } from '../../types/product';
import { ImageService } from '../../image.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  products: Product[];
  searchParams: any = {
    category: '',
    text: ''
  };
  bestRatedProducts: Product[];

  constructor(
    private productService: ProductService,
    private imageService: ImageService,
  ) { }

  ngOnInit() {
    this.productService.getProducts()
      .subscribe( products => {
        this.products = products;
        this.bestRatedProducts = products.sort(function(a,b){
          if (a.rating < b.rating) { return 1; }
          else if (a.rating == b.rating) { return 0; }
          else { return -1; }
        }).slice(0,3);
        console.log(this.bestRatedProducts);
      });
  }

  searchProducts(object: any){
    this.searchParams = object;
  }

  getProductImageUrl(product: Product): string {
    if (product.images)
      return this.imageService.getImageStyleUrl(product.images[0]);
    else
      return '';
    // return product ? this.imageService.getImageStyleUrl(product.images[0]) : '';
  }

}
