import { UploadInput, UploadOutput } from 'ngx-uploader';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-product-image-upload',
  templateUrl: './product-image-upload.component.html',
  styleUrls: ['./product-image-upload.component.scss']
})
export class ProductImageUploadComponent implements OnInit {

  @Input() uploadInput: UploadInput;
  @Output() uploadOutput = new EventEmitter<UploadOutput>();

  constructor() { }

  ngOnInit() {
  }

}
