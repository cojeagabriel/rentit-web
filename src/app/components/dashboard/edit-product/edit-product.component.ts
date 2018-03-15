import { Product } from './../../../types/product.d';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from '../../../types/user';
import { ProductService } from '../../../services/product.service';
import { UserService } from '../../../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {

  form: FormGroup;
  product: Product;
  errors: string;
  category: string[] = ['Electronics', 'Tools', 'Gardening'];
  per: string[] = ['Hour', 'Day', 'Month', 'Year'];

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.form = this.createForm();
    this.getProduct();
  }

  createForm() {
    return this.formBuilder.group({
      title: this.formBuilder.control('', Validators.required),
      _ownerId: '',
      description: this.formBuilder.control('', Validators.required),
      category: this.formBuilder.control('', Validators.required),
      price: this.formBuilder.control('', Validators.required),
      pricePer: this.formBuilder.control('', Validators.required)
    });
  }

  getProduct(): void{
    this.productService.getById(this.activatedRoute.snapshot.params.id)
      .subscribe(product =>{
        this.product = product[0];
        this.form.setValue({
          title: this.product.title,
          _ownerId: this.product._ownerId,
          description: this.product.description,
          category: this.product.category,
          price: this.product.price,
          pricePer: this.product.pricePer
        })
      });
  }

  update(): void {
    if (this.form.valid) {
      this.productService.update(this.form.value,this.activatedRoute.snapshot.params.id)
        .catch(err => {
          this.errors = err.error.msg;
          return Observable.throw(new Error(`${err.status} ${err.msg}`));
        })
        .subscribe(() => {
          this.router.navigate(["dashboard/my-products"]);
        });
    }
  }

}
