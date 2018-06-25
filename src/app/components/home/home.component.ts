import { SearchPipe } from './../../search.pipe';
import { ProductService } from './../../services/product.service';
import { Component, OnInit } from '@angular/core';
import { Product } from '../../types/product';
import { ImageService } from '../../image.service';

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

  constructor(
    private productService: ProductService,
    private imageService: ImageService
  ) { }

  ngOnInit() {
    this.productService.getProducts()
      .subscribe( products => {
        this.products = products;
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
