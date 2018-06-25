import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(products: any, obj: any): any {
    if (obj.text === ''){
      if (obj.category === '')
        return products;
      else
        return products.filter(function (product) {
          return product.category == obj.category;
        });
    }
    else {
      if (obj.category === '')
        return products.filter(function (product) {
          return product.title.toLowerCase().includes(obj.text.toLowerCase());
        });
      else
        return products.filter(function (product) {
          return product.title.toLowerCase().includes(obj.text.toLowerCase()) && product.category == obj.category;
        });
    }
      
  }

}
