import { UserService } from 'app/services/user.service';
import { ProductService } from 'app/services/product.service';
import { FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'app/types/user';
import { ImageService } from 'app/image.service';
import { Image } from 'app/types/image';
import { UploadOutput, UploadInput } from 'ngx-uploader';
import { environment } from 'environments/environment';
import { TokenService } from 'app/services/token.service';

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
  category: string[] = ['Electronics', 'Tools', 'Equipments', 'Sports', 'Furniture', 'Automobiles', 'Apartments'];
  per: string[]=['Hour','Day','Month','Year'];
  images: Image[] = [];
  uploadInput = new EventEmitter<UploadInput>();
  tempId: string;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private userService: UserService,
    private router: Router,
    private imageService: ImageService,
    private activatedRoute: ActivatedRoute,
    private tokenService: TokenService,
  ) { }

  ngOnInit() {
    this.form = this.createForm();
    this.form.patchValue({
      quantity: 1
    });
    this.getUser();
    this.createTempProduct();
  }

  createForm(){
    return this.formBuilder.group({
      title: this.formBuilder.control('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])),
      _ownerId: '',
      description: this.formBuilder.control('', Validators.compose([Validators.required, Validators.maxLength(10000)])),
      category: this.formBuilder.control('', Validators.required),
      quantity: this.formBuilder.control('', Validators.compose([Validators.required, Validators.min(1), Validators.max(100)])),
      price: this.formBuilder.control('', Validators.compose([Validators.required, Validators.min(0.001), Validators.max(100000000)])),
      pricePer: this.formBuilder.control('', Validators.required),
      tempId: this.formBuilder.control('', Validators.required),
      rating: 0
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
    if (this.form.valid) {
      this.productService.create(this.form.value)
        .catch(err => {
          this.errors = err.error.msg;
          return Observable.throw(new Error(`${err.status} ${err.msg}`));
        })
        .subscribe((product) => {
          this.router.navigate(["/dashboard/my-products", product._id]);
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

  onUploadOutput(output: UploadOutput): void {
    if (output.type === 'allAddedToQueue') { // when all files added in queue
      this.startUpload();
    } else if (output.type === 'done') { // when a file finished uploading
      this.images = output.file.response.images;
    }
  }

  startUpload(): void {
    if (!this.tempId){
      return;
    }

    const event: UploadInput = {
      type: 'uploadAll',
      url: `${environment.apiUrl}/api/products/temp/${this.tempId}/images`,
      method: 'POST',
      headers: {
        'x-access-token': this.tokenService.getToken()
      }
    };

    this.uploadInput.emit(event);
  }

  removeImage(image: Image) {
    if (!this.tempId) {
      return;
    }

    this.productService.removeTempImage(this.tempId, image).subscribe((tempProduct) => {
      this.images = tempProduct.images;
    }, () => {
      alert("Failed to delete image!");
    });
  }

  get mainImageUrl(): string {
    return this.imageService.getImageUrl(this.images[0]);
  }

  createTempProduct() {
    this.productService.createTemp().subscribe(tempProduct => {
      this.tempId = tempProduct._id;
      this.form.patchValue({tempId: this.tempId});
    });
  }

}
