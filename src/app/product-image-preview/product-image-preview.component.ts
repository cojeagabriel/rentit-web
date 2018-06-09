import { Image } from './../types/image';
import { Component, OnInit, HostBinding, Input, Output, EventEmitter } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-product-image-preview',
  templateUrl: './product-image-preview.component.html',
  styleUrls: ['./product-image-preview.component.scss']
})
export class ProductImagePreviewComponent implements OnInit {

  @Input() image: Image;
  @Output() onRemove = new EventEmitter<Image>();

  @HostBinding('style.background-image')
  get backgroundImage(): string {
    const url = this.image ? `${environment.apiUrl}/${this.image.path}` : this.defaultImageUrl;
    return `url(${url})`;
  }

  private defaultImageUrl = 'https://placehold.it/100x100';

  constructor() { }

  ngOnInit() {
  }

}
