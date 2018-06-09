import { environment } from 'environments/environment';
import { Product } from './../../../types/product.d';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from '../../../types/user';
import { ProductService } from '../../../services/product.service';
import { UserService } from '../../../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UploaderOptions, UploadFile, UploadOutput, UploadInput } from 'ngx-uploader';

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

  options: UploaderOptions;
  files: UploadFile[];
  dragOver: boolean;
  uploadInput: EventEmitter<UploadInput>;
  imagePreview: any;

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

    this.files = []; // local uploading files array
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
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

  onUploadOutput(output: UploadOutput): void {
    if (output.type === 'allAddedToQueue') { // when all files added in queue
      // uncomment this if you want to auto upload files when added
      // const event: UploadInput = {
      //   type: 'uploadAll',
      //   url: '/upload',
      //   method: 'POST',
      //   data: { foo: 'bar' }
      // };
      // this.uploadInput.emit(event);
    } else if (output.type === 'addedToQueue' && typeof output.file !== 'undefined') { // add file to array when added
      console.log(output);
      this.previewImagem(output.file.nativeFile).then(response => {
        this.imagePreview = response; // The image preview
        this.files.push(output.file);
      });
      // this.files.push(output.file);
    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      // update current data in files array for uploading file
      const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
      this.files[index] = output.file;
    } else if (output.type === 'removed') {
      // remove file from array when removed
      this.files = this.files.filter((file: UploadFile) => file !== output.file);
    } else if (output.type === 'dragOver') {
      this.dragOver = true;
    } else if (output.type === 'dragOut') {
      this.dragOver = false;
    } else if (output.type === 'drop') {
      this.dragOver = false;
    }

    // // Following the current example
    // if (output.type === 'addedToQueue') {
    //   this.previewImagem(output.nativeFile).then(response => {
    //     this.imagePreview = response; // The image preview
    //     this.files.push(output.file);
    //   });
    // }
  }

  startUpload(): void {
    const event: UploadInput = {
      type: 'uploadAll',
      url: `${environment.apiUrl}/api/products/${this.product._id}/images`,
      method: 'POST',
      data: { foo: 'bar' }
    };

    this.uploadInput.emit(event);
  }

  // The preview function
  previewImagem(file: File) {
    const fileReader = new FileReader();
    return new Promise(resolve => {
      console.log(file);
      fileReader.readAsDataURL(file);
      fileReader.onload = function (e: any) {
        console.log(e);
        resolve(e.target.result);
      }
    });
  }

}
