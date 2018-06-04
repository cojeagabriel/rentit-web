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

  popoverMessage: string = 'Are you sure you want to delete this product?';
  confirmClicked: boolean = false;
  cancelClicked: boolean = false;

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
      title: this.formBuilder.control('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])),
      _ownerId: '',
      description: this.formBuilder.control('', Validators.compose([Validators.required, Validators.maxLength(10000)])),
      category: this.formBuilder.control('', Validators.required),
      quantity: this.formBuilder.control('', Validators.compose([Validators.required, Validators.min(1), Validators.max(100)])),
      available: 0,
      price: this.formBuilder.control('', Validators.compose([Validators.required, Validators.min(0.001), Validators.max(100000000)])),
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
          quantity: this.product.quantity,
          available: this.product.available,
          price: this.product.price,
          pricePer: this.product.pricePer
        })
      });
  }

  update(): void {
    this.form.patchValue({
      available: this.form.get('quantity').value
    });
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

  quantityPlus(): void {
    if (this.form.get('quantity').value <= 100) {
      this.form.patchValue({
        quantity: this.form.get('quantity').value + 1
      });
    }
  }
  
  quantityMinus(): void {
    if (this.form.get('quantity').value > 1) {
      this.form.patchValue({
        quantity: this.form.get('quantity').value - 1
      });
    }
  }

  deleteProduct(): void {
    this.productService.delete(this.product)
      .catch(err => {
        return Observable.throw(err);
      })
      .subscribe(res => {
        this.router.navigate(['/dashboard/my-products']);
      });
  }


}
