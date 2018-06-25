import { Injectable } from '@angular/core';
import { Image } from 'app/types/image';
import { environment } from 'environments/environment';

@Injectable()
export class ImageService {

  private defaultImage = 'http://placehold.it/400x400?text=No+preview'

  constructor() { }

  getImageStyleUrl(image: Image | null | undefined): string {
    return `url(${this.getImageUrl(image)})`;
  }

  getImageUrl(image: Image | null | undefined): string {
    return image ? image.url : this.defaultImage;
  }

}
