import { ImageService } from 'app/image.service';
import { Image } from 'app/types/image';
import { Component, OnInit, HostBinding, Input, Output, EventEmitter } from '@angular/core';

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
    return this.imageService.getImageStyleUrl(this.image);
  }

  constructor(
    private imageService: ImageService
  ) { }

  ngOnInit() {
  }

}
