import { ProductService } from './../../../services/product.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {

  @Output() searchParams = new EventEmitter<object>();
  selectedText: string = '';
  selectedCategory: string = '';

  length: number;

  constructor(
    private productService: ProductService
  ) { }

  ngOnInit() {
    this.productService.getProducts()
      .subscribe(products =>{
        this.length = products.length;
      });
  }

  selectCategory(category: string){
    if(this.selectedCategory == category){
      this.selectedCategory = '';
    }
    else{
      this.selectedCategory = category;
    }
  }

  doSomething(newValue) {
    this.selectedText = newValue;
  }

  search(){
    this.searchParams.emit({category: this.selectedCategory, text: this.selectedText});
  }

  clear(){
    this.selectedText = '';
    this.selectedCategory = '';
    this.searchParams.emit({ category: this.selectedCategory, text: this.selectedText });
  }
}
