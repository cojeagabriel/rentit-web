import { UserService } from './../../../services/user.service';
import { ProductService } from './../../../services/product.service';
import { FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { User } from '../../../types/user';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.scss']
})
export class NewProductComponent implements OnInit {

  form: FormGroup;
  user: User | null;
  userId: string;
  errors: string;
  category: string[]=['Electronics','Tools','Gardening'];
  per: string[]=['Hour','Day','Month','Year'];

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.form = this.createForm();
    this.form.patchValue({
      quantity: 1
    });
    this.getUser();
  }

  createForm(){
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

  getUser(): void {
    this.userService.getMe()
      .catch(err => {
        return Observable.throw(err);
      })
      .subscribe(user => {
        this.user = user;
        this.form.patchValue({
          _ownerId: this.user._id
        })
      });
  }

  create(): void{
    this.form.setValue({
      available: this.form.get('quantity').value
    });
    if (this.form.valid) {
      this.productService.create(this.form.value)
        .catch(err => {
          this.errors = err.error.msg;
          return Observable.throw(new Error(`${err.status} ${err.msg}`));
        })
        .subscribe(() => {
          this.router.navigate(["/"]);
        });
    }
  }

  quantityPlus(): void{
    if (this.form.get('quantity').value<=100){
      this.form.patchValue({
        quantity: this.form.get('quantity').value + 1
      });
    }
  }
  quantityMinus(): void{
    if (this.form.get('quantity').value>1){
      this.form.patchValue({
        quantity: this.form.get('quantity').value - 1
      });
    }
  }

}
